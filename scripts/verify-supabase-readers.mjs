// Operator-only, anonymous reader checks. Never import into application code.
// No network without BOTH explicit opt-in and independent Dashboard confirmation.
import { pathToFileURL } from "node:url";
import { getSupabasePublicEnv, parseSupabasePublicEnv } from "../lib/supabase/env.ts";

// Explicit columns from the committed foundation migration, not shared-column guesses.
const columns = (value) => Object.freeze(value.split(","));
export const readerManifest = Object.freeze([
  { table: "organizations", approved: columns("id,name,short_name,official_url"), restricted: columns("archived_at,created_at,updated_at") },
  { table: "recruitments", approved: columns("id,organization_id,title,slug,advertisement_number,description,category,state,total_vacancies,lifecycle_status,how_to_apply"), restricted: columns("publication_state,verification_state,content_version,verified_version,verified_by,verified_at,published_at,archived_at,created_by,updated_by,created_at,updated_at") },
  { table: "recruitment_posts", approved: columns("id,recruitment_id,title,count,position"), restricted: columns("created_at,updated_at") },
  { table: "post_vacancy_counts", approved: columns("post_id,category,count"), restricted: columns("created_at,updated_at") },
  { table: "recruitment_eligibility_rules", approved: columns("id,recruitment_id,post_id,qualification,minimum_age,maximum_age,age_cutoff_date,notes,position"), restricted: columns("created_at,updated_at") },
  { table: "recruitment_dates", approved: columns("id,recruitment_id,kind,label,date,notes,position"), restricted: columns("created_at,updated_at") },
  { table: "recruitment_fees", approved: columns("id,recruitment_id,category,amount,currency,notes,position"), restricted: columns("created_at,updated_at") },
  { table: "recruitment_links", approved: columns("id,recruitment_id,label,url,position"), restricted: columns("source_id,created_at,updated_at") },
  { table: "recruitment_documents", approved: columns("id,recruitment_id,label,kind,url,position"), restricted: columns("source_id,created_at,updated_at") },
  { table: "recruitment_selection_stages", approved: columns("id,recruitment_id,name,description,position"), restricted: columns("created_at,updated_at") },
  { table: "recruitment_salary", approved: columns("recruitment_id,post_id,description"), restricted: columns("created_at,updated_at") },
  { table: "recruitment_exam_patterns", approved: columns("id,recruitment_id,subject,stage_id,questions,marks,duration_minutes,position"), restricted: columns("created_at,updated_at") },
  { table: "recruitment_faqs", approved: columns("id,recruitment_id,question,answer,position"), restricted: columns("created_at,updated_at") },
  { table: "recruitment_updates", approved: columns("id,recruitment_id,kind,title,description,date"), restricted: columns("source_id,publication_state,verification_state,content_version,verified_version,verified_by,verified_at,published_at,archived_at,created_by,updated_by,created_at,updated_at") },
  { table: "recruitment_sources", approved: Object.freeze([]), restricted: columns("id,recruitment_id,label,url,origin,captured_at,captured_by,document_reference,document_hash,position,created_at,updated_at") },
  { table: "recruitment_reviews", approved: Object.freeze([]), restricted: columns("id,recruitment_id,update_id,content_version,decision,reviewer_id,reviewed_at,verification_notes,evidence_snapshot") },
  { table: "editor_memberships", approved: Object.freeze([]), restricted: columns("user_id,role,created_at,granted_by") },
].map(Object.freeze));

export function anonymousChecks(includeWildcards = false) {
  const checks = [];
  for (const entry of readerManifest.filter((item) => item.approved.length)) {
    checks.push({ table: entry.table, projection: entry.approved.join(","), category: "approved", allowed: true });
  }
  for (const entry of readerManifest) {
    for (const column of entry.restricted) {
      checks.push({ table: entry.table, projection: column, category: entry.approved.length ? "excluded" : "private", allowed: false });
    }
  }
  if (includeWildcards) {
    for (const entry of readerManifest) {
      checks.push({ table: entry.table, projection: "*", category: "wildcard", allowed: false });
    }
  }
  return checks;
}

// No caller-supplied path, query, headers, body, embedding or credentials override.
export function buildReaderRequest(config, check, method = "GET") {
  if (!["GET", "HEAD"].includes(method)) throw new Error("Unsupported reader method.");
  const entry = readerManifest.find((item) => item.table === check?.table);
  const known = entry && anonymousChecks(true).some((item) =>
    item.table === check.table && item.projection === check.projection &&
    item.category === check.category && item.allowed === check.allowed);
  if (!known || Object.keys(check).some((key) => !["table", "projection", "category", "allowed"].includes(key))) {
    throw new Error("Unsupported reader projection/path.");
  }
  const parsed = parseSupabasePublicEnv(config.url, config.publishableKey);
  const origin = new URL(parsed.url);
  // Only hosted project origins in this phase; custom/local endpoints need review.
  if (origin.protocol !== "https:" || !/^[a-z0-9]{20}\.supabase\.co$/.test(origin.hostname) || origin.port) {
    throw new Error("Unsupported hosted project origin.");
  }
  const url = new URL(`/rest/v1/${entry.table}`, origin);
  url.searchParams.set("select", check.projection);
  url.searchParams.set("limit", "0");
  return { url, init: {
    method, redirect: "error", credentials: "omit", cache: "no-store",
    headers: { apikey: parsed.publishableKey, Accept: "application/json", "Accept-Profile": "public" },
  } };
}

const safeCodes = new Set(["42501", "42703", "42P01", "3F000", "PGRST200", "PGRST204", "PGRST205", "PGRST301", "PGRST302", "PGRST303"]);
const schemaCodes = new Set(["42703", "42P01", "3F000", "PGRST200", "PGRST204", "PGRST205"]);

// Return only static labels/status and allowlisted codes, never error text or records.
export function classifyReaderResponse(allowed, status, payload) {
  const code = payload && !Array.isArray(payload) && safeCodes.has(payload.code) ? payload.code : null;
  let outcome;
  if (status === 408) outcome = "INCONCLUSIVE_NETWORK";
  else if (status === 429) outcome = "INCONCLUSIVE_RATE_LIMIT";
  else if (status >= 500 && status <= 599) outcome = "INCONCLUSIVE_SERVER";
  else if (status >= 300 && status <= 399) outcome = "FAIL_REDIRECT";
  else if (status >= 200 && status <= 299) {
    outcome = !allowed ? "FAIL_UNEXPECTED_ALLOW" :
      Array.isArray(payload) && payload.length === 0 ? "PASS_ALLOWED_EMPTY" : "FAIL_RESPONSE_FORMAT";
  } else if ((status === 401 || status === 403) && code === "42501") {
    outcome = allowed ? "FAIL_UNEXPECTED_DENY" : "PASS_PERMISSION_DENIED";
  } else if (schemaCodes.has(code)) outcome = "FAIL_SCHEMA_MISMATCH";
  else if (status === 401 || status === 403 || code?.startsWith("PGRST30")) outcome = "FAIL_AUTH_OR_API_KEY";
  else outcome = "FAIL_RESPONSE_FORMAT";
  return { outcome, httpStatus: status, code };
}

const MAX_BODY_BYTES = 16_384;
async function readBoundedJson(response) {
  const reader = response.body?.getReader();
  if (!reader) return null;
  const decoder = new TextDecoder();
  let size = 0;
  let text = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) return null;
      text += decoder.decode(value, { stream: true });
    }
    try { return JSON.parse(text + decoder.decode()); }
    catch { return null; }
  } finally {
    // Do not wait on cancellation: a broken stream must not defeat the deadline.
    void reader.cancel().catch(() => {});
  }
}

async function performRead(request, allowed, fetchImpl, timeoutMs) {
  const controller = new AbortController();
  let timer;
  const timeout = new Promise((resolve) => {
    timer = setTimeout(() => {
      controller.abort();
      resolve({ outcome: "INCONCLUSIVE_NETWORK", httpStatus: null, code: null });
    }, timeoutMs);
  });
  const operation = (async () => {
    try {
      const response = await fetchImpl(request.url, { ...request.init, signal: controller.signal });
      if (response.redirected || (response.url && response.url !== request.url.href)) {
        return { outcome: "FAIL_REDIRECT", httpStatus: response.status, code: null };
      }
      // These statuses cannot become permission passes regardless of their bodies.
      if (response.status === 408 || response.status === 429 || response.status >= 500 || (response.status >= 300 && response.status < 400)) {
        void response.body?.cancel().catch(() => {});
        return classifyReaderResponse(allowed, response.status, null);
      }
      // Stream transport failures propagate to the network classifier; malformed
      // or oversized JSON returns null and cannot pass a permission assertion.
      const payload = await readBoundedJson(response);
      return classifyReaderResponse(allowed, response.status, payload);
    } catch {
      // Native fetch refuses redirects with TypeError too: never follow/retry it.
      return { outcome: "INCONCLUSIVE_NETWORK", httpStatus: null, code: null };
    }
  })();
  try { return await Promise.race([operation, timeout]); }
  finally { clearTimeout(timer); controller.abort(); }
}

export async function verifyAnonymousReaders(options = {}) {
  const supported = ["allowNetwork", "confirmedProject", "expectedProjectRef", "includeWildcards", "fetchImpl", "requestTimeoutMs", "runTimeoutMs"];
  const checks = anonymousChecks(options.includeWildcards === true);
  const categories = { approved: 0, excluded: 0, private: 0, wildcard: 0 };
  for (const check of checks) categories[check.category]++;
  const summary = {
    mode: "ANONYMOUS", authenticated: "NOT RUN", ok: false, status: "NOT_RUN",
    planned: checks.length, categories, completed: 0, passed: 0, results: [],
    limits: "Zero-row projection/grant checks only; not row visibility, HTTP write denial or auth.uid verification.",
  };
  if (Object.keys(options).some((key) => !supported.includes(key))) {
    return { ...summary, message: "Unsupported option; no request sent." };
  }
  if (options.allowNetwork !== true || options.confirmedProject !== "myresult") {
    return { ...summary, message: "No request sent. Separate execution approval, --allow-network and --confirm-project=myresult are required after independently matching Dashboard project/configuration." };
  }
  // Independently copied from the NEW myresult Dashboard, never derived from env.
  if (typeof options.expectedProjectRef !== "string" || !/^[a-z0-9]{20}$/.test(options.expectedProjectRef)) {
    return { ...summary, message: "An independently confirmed expected project ref is required; value withheld. No request sent." };
  }
  const requestTimeoutMs = options.requestTimeoutMs ?? 10_000;
  const runTimeoutMs = options.runTimeoutMs ?? 180_000;
  if (!Number.isFinite(requestTimeoutMs) || requestTimeoutMs <= 0 || requestTimeoutMs > 10_000 ||
      !Number.isFinite(runTimeoutMs) || runTimeoutMs <= 0 || runTimeoutMs > 180_000 ||
      (options.fetchImpl !== undefined && typeof options.fetchImpl !== "function")) {
    return { ...summary, message: "Invalid bounded request configuration; no request sent." };
  }
  let requests;
  try {
    const config = getSupabasePublicEnv();
    requests = checks.map((check) => buildReaderRequest(config, check));
    // Compare the actual snapshotted requests, so inherited env precedence cannot
    // bind one configuration while fetch later uses another. Never echo refs.
    if (requests.some(({ url }) => url.hostname !== `${options.expectedProjectRef}.supabase.co`)) {
      return { ...summary, status: "FAIL", message: "Effective endpoint does not match the independently confirmed project; values withheld. No request sent." };
    }
  } catch {
    return { ...summary, status: "FAIL", message: "Invalid public/hosted project configuration; values withheld. No request sent." };
  }
  const fetchImpl = options.fetchImpl ?? globalThis.fetch;
  const started = performance.now();
  for (let index = 0; index < checks.length; index++) {
    const remaining = runTimeoutMs - (performance.now() - started);
    if (remaining <= 0) {
      summary.status = "INCONCLUSIVE";
      summary.message = "Whole-run deadline reached; remaining checks not run.";
      return summary;
    }
    const check = checks[index];
    const result = await performRead(requests[index], check.allowed, fetchImpl, Math.min(requestTimeoutMs, remaining));
    summary.results.push({ ...check, ...result });
    summary.completed++;
    if (result.outcome.startsWith("PASS_")) summary.passed++;
    else {
      summary.status = result.outcome.startsWith("INCONCLUSIVE_") ? "INCONCLUSIVE" : "FAIL";
      summary.message = "Stopped at first non-pass; remaining checks not run. Response details withheld.";
      return summary;
    }
  }
  return { ...summary, ok: true, status: "PASS", message: "Anonymous projection checks passed only within the stated limits. Authenticated verification NOT RUN." };
}

// Compact operator output: counts plus at most the first non-pass, not 91/108 rows.
export function readerReport({ results = [], ...summary }) {
  return { ...summary, firstNonPass: results.find((result) => !result.outcome.startsWith("PASS_")) ?? null };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  const knownArgs = ["--allow-network", "--confirm-project=myresult", "--include-wildcards"];
  const refArgs = args.filter((arg) => arg.startsWith("--expected-project-ref="));
  const result = refArgs.length > 1 || args.some((arg) => !knownArgs.includes(arg) && !arg.startsWith("--expected-project-ref="))
    ? { ok: false, status: "NOT_RUN", message: "Unsupported argument; no request sent. Arguments withheld." }
    : await verifyAnonymousReaders({
      allowNetwork: args.includes("--allow-network"),
      confirmedProject: args.includes("--confirm-project=myresult") ? "myresult" : undefined,
      expectedProjectRef: refArgs[0]?.slice("--expected-project-ref=".length),
      includeWildcards: args.includes("--include-wildcards"),
    });
  console.log(JSON.stringify(readerReport(result), null, 2));
  process.exitCode = result.ok ? 0 : 1;
}
