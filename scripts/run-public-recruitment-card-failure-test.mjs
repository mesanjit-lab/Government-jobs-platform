// Operator-only Phase 2C Batch 2B failure-flow runner. It is never imported by
// the application and performs no work without explicit database opt-in.
import { spawn } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const EXPECTED_SQLSTATE = "P0001";
const EXPECTED_ERROR_MESSAGE = "Public card migration requires every published recruitment to be complete";
const TARGET_PREFIX = "--expected-target=";
const SERVICE_PREFIX = "--pg-service=";
const allowedOptionNames = new Set(["args", "execute"]);

const refuse = (status = "NOT_RUN") => ({
  mode: "PHASE_2C_BATCH_2B_FAILURE",
  ok: false,
  status,
  message: "No failure-flow verification result. Details withheld.",
});

function validIdentifier(value) {
  return typeof value === "string" && /^[A-Za-z][A-Za-z0-9_-]{0,62}$/.test(value);
}

export function parseFailureRunnerArguments(args = process.argv.slice(2)) {
  if (!Array.isArray(args) || new Set(args).size !== args.length || !args.includes("--allow-database")) return undefined;
  const targets = args.filter((arg) => typeof arg === "string" && arg.startsWith(TARGET_PREFIX));
  const services = args.filter((arg) => typeof arg === "string" && arg.startsWith(SERVICE_PREFIX));
  if (targets.length !== 1 || services.length !== 1 || args.length !== 3 ||
      args.some((arg) => arg !== "--allow-database" && !arg.startsWith(TARGET_PREFIX) && !arg.startsWith(SERVICE_PREFIX))) return undefined;
  const expectedTarget = targets[0].slice(TARGET_PREFIX.length);
  const service = services[0].slice(SERVICE_PREFIX.length);
  return validIdentifier(expectedTarget) && validIdentifier(service) ? { expectedTarget, service } : undefined;
}

const fixtureName = "TEST_B2B_FAILURE_INCOMPLETE_LEGACY";
const preflightSql = `select json_build_object(
  'database_name', current_database(),
  'sentinel_count', (select count(*) from private.batch_2b_isolated_sentinel),
  'sentinel_marker_count', (select count(*) from private.batch_2b_isolated_sentinel where marker = 'TEST_B2B_ISOLATED_DATABASE_V1'),
  'recruitment_count', (select count(*) from public.recruitments),
  'failure_fixture_count', (select count(*) from public.recruitments where title = '${fixtureName}'),
  'batch_2a_object_count', (
    (to_regclass('public.public_recruitment_cards') is not null)::integer +
    (to_regclass('public.recruitment_eligibility_rules_card_candidates') is not null)::integer +
    (to_regclass('public.recruitment_dates_card_deadline_lookup') is not null)::integer +
    (to_regprocedure('private.is_complete_public_recruitment_card(uuid)') is not null)::integer +
    (to_regprocedure('private.guard_public_recruitment_card()') is not null)::integer +
    (select count(*) from pg_trigger t join pg_class c on c.oid = t.tgrelid join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public' and c.relname = 'recruitments' and t.tgname = 'zzz_recruitment_public_card_ready' and not t.tgisinternal)
  )
)::text;`;

function parseSingleJson(stdout) {
  const lines = String(stdout).split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length !== 1) return undefined;
  try {
    const value = JSON.parse(lines[0]);
    return value && typeof value === "object" && !Array.isArray(value) ? value : undefined;
  } catch { return undefined; }
}

export function isValidFailurePreflight(value, expectedTarget) {
  return value?.database_name === expectedTarget && value.sentinel_count === 1 &&
    value.sentinel_marker_count === 1 && value.recruitment_count === 1 &&
    value.failure_fixture_count === 1 && value.batch_2a_object_count === 0;
}

export function hasExactExpectedMigrationFailure(result) {
  if (!result || result.exitCode !== 3) return false;
  const output = `${String(result.stdout)}\n${String(result.stderr)}`;
  const exact = new RegExp(`ERROR:\\s+${EXPECTED_SQLSTATE}:\\s+${EXPECTED_ERROR_MESSAGE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:\\r?\\n|$)`, "g");
  const matches = output.match(exact) ?? [];
  return matches.length === 1 && !/ERROR:\s+(?!P0001:\s+Public card migration requires every published recruitment to be complete(?:\r?\n|$))/m.test(output);
}

export function buildPsqlArguments(service, database, argumentsList) {
  if (!validIdentifier(service) || !validIdentifier(database) || !Array.isArray(argumentsList)) return undefined;
  return ["--no-psqlrc", "--no-password", "--set=ON_ERROR_STOP=1", "--set=VERBOSITY=verbose", `--dbname=service=${service} dbname=${database}`, ...argumentsList];
}

export function buildPsqlEnvironment(parentEnvironment = process.env) {
  const inheritedOptions = typeof parentEnvironment?.PGOPTIONS === "string" ? parentEnvironment.PGOPTIONS.trim() : "";
  return {
    ...parentEnvironment,
    // Keep any caller-required session settings while making the expected
    // PostgreSQL diagnostic text parser-stable for this child process only.
    PGOPTIONS: `${inheritedOptions ? `${inheritedOptions} ` : ""}-c lc_messages=C`,
  };
}

function runPsql(service, database, argumentsList) {
  const psqlArguments = buildPsqlArguments(service, database, argumentsList);
  if (!psqlArguments) return Promise.resolve({ exitCode: undefined, stdout: "", stderr: "" });
  return new Promise((resolve) => {
    let stdout = "";
    let stderr = "";
    let settled = false;
    const settle = (result) => {
      if (!settled) { settled = true; resolve(result); }
    };
    try {
      const child = spawn("psql", psqlArguments, {
        stdio: ["ignore", "pipe", "pipe"],
        windowsHide: true,
        // The exact error text is intentionally English/C and parser-stable.
        // If the server rejects this startup setting, psql fails closed.
        env: buildPsqlEnvironment(process.env),
      });
      child.stdout.on("data", (chunk) => { stdout += String(chunk); });
      child.stderr.on("data", (chunk) => { stderr += String(chunk); });
      child.once("error", () => settle({ exitCode: undefined, stdout, stderr }));
      child.once("close", (code) => settle({ exitCode: code, stdout, stderr }));
    } catch { settle({ exitCode: undefined, stdout, stderr }); }
  });
}

const migrationPath = fileURLToPath(new URL("../supabase/migrations/20261009000100_public_recruitment_card_boundary.sql", import.meta.url));
const assertionsPath = fileURLToPath(new URL("../supabase/tests/phase_2c_batch_2b_failure_assertions.sql", import.meta.url));

export async function runFailureMigrationTest(options = {}) {
  if (!options || Object.keys(options).some((name) => !allowedOptionNames.has(name))) return refuse();
  const parsed = parseFailureRunnerArguments(options.args ?? process.argv.slice(2));
  if (!parsed) return refuse();
  const execute = options.execute ?? (async (kind) => {
    if (kind === "preflight") return runPsql(parsed.service, parsed.expectedTarget, ["--tuples-only", "--no-align", "--quiet", "--command", preflightSql]);
    if (kind === "migration") return runPsql(parsed.service, parsed.expectedTarget, ["--file", migrationPath]);
    if (kind === "assertions") return runPsql(parsed.service, parsed.expectedTarget, ["--quiet", "--file", assertionsPath]);
    return { exitCode: undefined, stdout: "", stderr: "" };
  });
  try {
    const preflight = await execute("preflight");
    if (preflight?.exitCode !== 0 || !isValidFailurePreflight(parseSingleJson(preflight.stdout), parsed.expectedTarget)) return refuse("FAIL");
    const migration = await execute("migration");
    // psql exits after the first error, closing its connection. PostgreSQL then
    // rolls back the aborted migration transaction before assertions open a new session.
    if (!hasExactExpectedMigrationFailure(migration)) return refuse("FAIL");
    const assertions = await execute("assertions");
    if (assertions?.exitCode !== 0) return refuse("FAIL");
    return { mode: "PHASE_2C_BATCH_2B_FAILURE", ok: true, status: "PASS", message: "Expected migration preflight verified; no partial Batch 2A objects." };
  } catch { return refuse("FAIL"); }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = await runFailureMigrationTest();
  console.log(JSON.stringify(result, null, 2));
  process.exitCode = result.ok ? 0 : 1;
}
