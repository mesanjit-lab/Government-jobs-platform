// Offline-only checks for the Phase 2C Batch 2B failure-flow runner.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  buildPsqlEnvironment,
  buildPsqlArguments,
  hasExactExpectedMigrationFailure,
  isValidFailurePreflight,
  parseFailureRunnerArguments,
  runFailureMigrationTest,
} from "./run-public-recruitment-card-failure-test.mjs";

const args = ["--allow-database", "--expected-target=TestB2bFailure", "--pg-service=TestB2bService"];
const expectedError = "Public card migration requires every published recruitment to be complete";
const goodPreflight = {
  database_name: "TestB2bFailure",
  sentinel_count: 1,
  sentinel_marker_count: 1,
  recruitment_count: 1,
  failure_fixture_count: 1,
  batch_2a_object_count: 0,
};
let assertions = 0;
let failed = false;
let stage = "start";
const check = (fn) => { assertions++; fn(); };
const result = (exitCode, stdout = "", stderr = "") => ({ exitCode, stdout, stderr });
const asJson = (value) => `${JSON.stringify(value)}\n`;

try {
  stage = "argument parsing";
  check(() => assert.deepEqual(parseFailureRunnerArguments(args), { expectedTarget: "TestB2bFailure", service: "TestB2bService" }));
  for (const invalid of [[], args.slice(1), [...args, "--unexpected"], [...args, "--pg-service=again"], ["--allow-database", "--expected-target=bad target", "--pg-service=TestB2bService"]]) {
    check(() => assert.equal(parseFailureRunnerArguments(invalid), undefined));
  }
  for (const service of ["", "service=other", "service other", "service;drop", "../service", "service\"quoted"]) {
    check(() => assert.equal(parseFailureRunnerArguments(["--allow-database", "--expected-target=TestB2bFailure", `--pg-service=${service}`]), undefined));
  }
  check(() => assert.deepEqual(buildPsqlArguments("TestB2bService", "TestB2bFailure", ["--file", "fixed.sql"]), [
    "--no-psqlrc", "--no-password", "--set=ON_ERROR_STOP=1", "--set=VERBOSITY=verbose",
    "--dbname=service=TestB2bService dbname=TestB2bFailure", "--file", "fixed.sql",
  ]));
  check(() => assert.equal(buildPsqlArguments("bad service", "TestB2bFailure", []), undefined));

  stage = "child process locale environment";
  const noOptions = { HOME: "test-home" };
  const emptyOptions = { HOME: "test-home", PGOPTIONS: "" };
  const whitespaceOptions = { HOME: "test-home", PGOPTIONS: "  \t " };
  const requiredOptions = { HOME: "test-home", PGOPTIONS: "  -c statement_timeout=5000  -c lock_timeout=1000  " };
  check(() => assert.deepEqual(buildPsqlEnvironment(noOptions), { HOME: "test-home", PGOPTIONS: "-c lc_messages=C" }));
  check(() => assert.deepEqual(buildPsqlEnvironment(emptyOptions), { HOME: "test-home", PGOPTIONS: "-c lc_messages=C" }));
  check(() => assert.deepEqual(buildPsqlEnvironment(whitespaceOptions), { HOME: "test-home", PGOPTIONS: "-c lc_messages=C" }));
  check(() => assert.deepEqual(buildPsqlEnvironment(requiredOptions), {
    HOME: "test-home",
    PGOPTIONS: "-c statement_timeout=5000  -c lock_timeout=1000 -c lc_messages=C",
  }));
  check(() => assert.deepEqual(requiredOptions, {
    HOME: "test-home",
    PGOPTIONS: "  -c statement_timeout=5000  -c lock_timeout=1000  ",
  }));
  const parentOptionsBefore = process.env.PGOPTIONS;
  buildPsqlEnvironment();
  check(() => assert.equal(process.env.PGOPTIONS, parentOptionsBefore));

  stage = "preflight validation";
  check(() => assert.equal(isValidFailurePreflight(goodPreflight, "TestB2bFailure"), true));
  for (const key of ["sentinel_count", "sentinel_marker_count", "recruitment_count", "failure_fixture_count", "batch_2a_object_count"]) {
    const altered = { ...goodPreflight, [key]: key === "batch_2a_object_count" ? 1 : 0 };
    check(() => assert.equal(isValidFailurePreflight(altered, "TestB2bFailure"), false));
  }
  check(() => assert.equal(isValidFailurePreflight({ ...goodPreflight, sentinel_count: 2, sentinel_marker_count: 2 }, "TestB2bFailure"), false));
  check(() => assert.equal(isValidFailurePreflight(goodPreflight, "OtherTarget"), false));

  stage = "exact migration error";
  const exactFailure = result(3, "", `ERROR: P0001: ${expectedError}\n`);
  check(() => assert.equal(hasExactExpectedMigrationFailure(exactFailure), true));
  for (const invalid of [
    result(0, "", `ERROR: P0001: ${expectedError}\n`),
    result(3, "", "ERROR: P0001: another failure\n"),
    result(3, "", `ERROR: XX000: ${expectedError}\n`),
    result(3, "", `ERROR: P0001: ${expectedError}\nERROR: XX000: later error\n`),
    result(2, "", `ERROR: P0001: ${expectedError}\n`),
    result(undefined, "", `ERROR: P0001: ${expectedError}\n`),
  ]) check(() => assert.equal(hasExactExpectedMigrationFailure(invalid), false));

  stage = "runner sequencing";
  const calls = [];
  const execute = async (kind) => {
    calls.push(kind);
    if (kind === "preflight") return result(0, asJson(goodPreflight));
    if (kind === "migration") return exactFailure;
    return result(0, "assertions-completed\n");
  };
  const pass = await runFailureMigrationTest({ args, execute });
  check(() => assert.equal(pass.status, "PASS"));
  check(() => assert.deepEqual(calls, ["preflight", "migration", "assertions"]));
  for (const [label, preflight, migration] of [
    ["wrong target", { ...goodPreflight, database_name: "OtherTarget" }, exactFailure],
    ["missing sentinel", { ...goodPreflight, sentinel_count: 0, sentinel_marker_count: 0 }, exactFailure],
    ["wrong sentinel", { ...goodPreflight, sentinel_marker_count: 0 }, exactFailure],
    ["duplicate sentinel", { ...goodPreflight, sentinel_count: 2, sentinel_marker_count: 2 }, exactFailure],
    ["unexpected success", goodPreflight, result(0)],
    ["wrong expected error", goodPreflight, result(3, "", "ERROR: P0001: other\n")],
    ["unexpected migration exit", goodPreflight, result(2, "", `ERROR: P0001: ${expectedError}\n`)],
    ["migration spawn failure", goodPreflight, result(undefined)],
  ]) {
    stage = label;
    const attempted = [];
    const output = await runFailureMigrationTest({ args, execute: async (kind) => {
      attempted.push(kind);
      if (kind === "preflight") return result(0, asJson(preflight));
      if (kind === "migration") return migration;
      return result(0, "unexpected");
    } });
    check(() => assert.equal(output.status, "FAIL"));
    check(() => assert.equal(attempted.includes("assertions"), false));
  }
  stage = "assertion failure";
  const assertionCalls = [];
  const assertionFailure = await runFailureMigrationTest({ args, execute: async (kind) => {
    assertionCalls.push(kind);
    if (kind === "preflight") return result(0, asJson(goodPreflight));
    if (kind === "migration") return exactFailure;
    return result(1, "", "assertion failure");
  } });
  check(() => assert.equal(assertionFailure.status, "FAIL"));
  check(() => assert.deepEqual(assertionCalls, ["preflight", "migration", "assertions"]));
  stage = "preflight spawn failure";
  const preflightFailureCalls = [];
  const preflightSpawnFailure = await runFailureMigrationTest({ args, execute: async (kind) => {
    preflightFailureCalls.push(kind);
    return result(undefined);
  } });
  check(() => assert.equal(preflightSpawnFailure.status, "FAIL"));
  check(() => assert.deepEqual(preflightFailureCalls, ["preflight"]));

  stage = "source restrictions";
  const source = readFileSync(fileURLToPath(new URL("./run-public-recruitment-card-failure-test.mjs", import.meta.url)), "utf8");
  check(() => assert.ok(!/service_role|auth\.users|createClient|fetch\s*\(/i.test(source)));
  check(() => assert.ok(!/DATABASE_URL|PGPASSWORD|postgres(?:ql)?:\/\//i.test(source)));
  check(() => assert.ok(/--allow-database/.test(source) && /--expected-target=/.test(source) && /--pg-service=/.test(source)));
  check(() => assert.ok(/--no-password/.test(source) && /service=\$\{service\} dbname=\$\{database\}/.test(source)));
  check(() => assert.ok(/env: buildPsqlEnvironment\(process\.env\)/.test(source)));
  check(() => assert.ok(/inheritedOptions \? `\$\{inheritedOptions\} ` : ""/.test(source)));
  check(() => assert.ok(/kind === "preflight"[\s\S]*runPsql[\s\S]*kind === "migration"[\s\S]*runPsql[\s\S]*kind === "assertions"[\s\S]*runPsql/.test(source)));
  check(() => assert.ok(/sentinel_count[\s\S]*sentinel_marker_count[\s\S]*batch_2a_object_count/.test(source)));
  check(() => assert.ok(/hasExactExpectedMigrationFailure[\s\S]*P0001/.test(source)));
} catch {
  failed = true;
}

console.log(failed ? `Offline Batch 2B failure-runner checks FAILED at fixed stage: ${stage}; details withheld.` :
  `${assertions} offline Batch 2B failure-runner checks passed; zero database connections and zero SQL execution.`);
process.exitCode = failed ? 1 : 0;
