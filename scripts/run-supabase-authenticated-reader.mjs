// Operator-only acquisition runner. Not application authentication or a session store.
import { createClient } from "@supabase/supabase-js";
import { createInterface } from "node:readline/promises";
import { pathToFileURL } from "node:url";
import { getSupabasePublicEnv } from "../lib/supabase/env.ts";
import { EXPECTED_SUBJECT, verifyAuthenticatedReaders } from "./verify-supabase-authenticated-reader.mjs";

const MAX_PASSWORD = 1_024;
const REF_PREFIX = "--expected-project-ref=";
const refuse = (status = "NOT_RUN") => ({
  mode: "AUTHENTICATED_JWT_READER", ok: false, status,
  message: "No verification result. Details withheld.",
});

function validRef(value) {
  return typeof value === "string" && /^[a-z0-9]{20}$/.test(value);
}

function validEmail(value) {
  return typeof value === "string" && value.length <= 320 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// Concealed, local-only TTY password intake. No argv, env, file, or echo path.
export async function readConcealedPassword(input = process.stdin, output = process.stderr, timeoutMs = 60_000, runtime = process) {
  if (!input.isTTY || !output.isTTY || typeof input.setRawMode !== "function" ||
      typeof input.listenerCount !== "function" || input.listenerCount("data") !== 0 ||
      !runtime || typeof runtime.on !== "function" || typeof runtime.once !== "function" ||
      typeof runtime.removeListener !== "function" || !Number.isFinite(timeoutMs) || timeoutMs <= 0 || timeoutMs > 60_000) return undefined;
  return new Promise((resolve) => {
    let password = "";
    let finished = false;
    let timer;
    const wasRaw = input.isRaw === true;
    const wasPaused = input.isPaused();
    const restore = () => {
      try { input.setRawMode(wasRaw); } catch { return false; }
      if (wasPaused) input.pause();
      return true;
    };
    const finish = (value) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      for (const [event, listener] of [["data", onData], ["error", stop], ["end", stop], ["close", stop]]) input.removeListener(event, listener);
      runtime.removeListener("SIGINT", stop); runtime.removeListener("SIGTERM", stop); runtime.removeListener("exit", stop);
      if (!restore()) value = undefined;
      password = "";
      resolve(value);
    };
    const stop = () => finish(undefined);
    const onData = (chunk) => {
      try {
        const value = String(chunk);
        if (value.length > MAX_PASSWORD + 2) return stop();
        for (let index = 0; index < value.length; index++) {
          const character = value[index];
          if (character === "\r" || character === "\n") {
            if (!/^[\r\n]*$/.test(value.slice(index + 1))) return stop();
            return finish(password || undefined);
          }
          if (character === "\b" || character === "\x7f") password = password.slice(0, -1);
          else if (character < " " || character === "\x7f" || character === "\x1b") return stop();
          else password += character;
          if (password.length > MAX_PASSWORD) return stop();
        }
      } catch { stop(); }
    };
    try {
      input.setRawMode(true);
      runtime.on("SIGINT", stop); runtime.on("SIGTERM", stop); runtime.once("exit", stop);
      output.write("Reviewer password (concealed; Enter to finish, Ctrl-C to cancel): ");
      input.on("data", onData).on("error", stop).on("end", stop).on("close", stop);
      timer = setTimeout(stop, timeoutMs);
      input.resume();
    } catch { stop(); }
  });
}

export async function readReviewerEmail(input = process.stdin, output = process.stderr) {
  if (!input.isTTY || !output.isTTY) return undefined;
  const terminal = createInterface({ input, output, terminal: true });
  try {
    const email = (await terminal.question("Reviewer email: ")).trim();
    return validEmail(email) ? email : undefined;
  } catch { return undefined; }
  finally { terminal.close(); }
}

export function parseOperatorArguments(args = process.argv.slice(2)) {
  const known = ["--allow-network", "--confirm-project=myresult", "--include-wildcards"];
  const refs = args.filter((arg) => arg.startsWith(REF_PREFIX));
  if (!Array.isArray(args) || refs.length !== 1 || new Set(args).size !== args.length ||
      args.some((arg) => !known.includes(arg) && !arg.startsWith(REF_PREFIX)) ||
      !args.includes("--allow-network") || !args.includes("--confirm-project=myresult")) return undefined;
  const expectedProjectRef = refs[0].slice(REF_PREFIX.length);
  return validRef(expectedProjectRef) ? { expectedProjectRef, includeWildcards: args.includes("--include-wildcards") } : undefined;
}

// Dependencies are injectable solely for offline tests. CLI calls use only the fixed defaults.
export async function runAuthenticatedReaderOperator(options = {}) {
  const supported = ["args", "promptEmail", "promptPassword", "getEnv", "createClientImpl", "verifyImpl"];
  if (Object.keys(options).some((key) => !supported.includes(key))) return refuse();
  const parsed = parseOperatorArguments(options.args ?? process.argv.slice(2));
  if (!parsed) return refuse();
  const promptEmail = options.promptEmail ?? readReviewerEmail;
  const promptPassword = options.promptPassword ?? readConcealedPassword;
  const getEnv = options.getEnv ?? getSupabasePublicEnv;
  const createClientImpl = options.createClientImpl ?? createClient;
  const verifyImpl = options.verifyImpl ?? verifyAuthenticatedReaders;
  let password = "";
  let accessToken = "";
  try {
    const config = getEnv();
    if (!config || !validRef(parsed.expectedProjectRef) || new URL(config.url).hostname !== `${parsed.expectedProjectRef}.supabase.co`) return refuse("FAIL");
    const email = await promptEmail();
    if (!validEmail(email)) return refuse();
    password = await promptPassword();
    if (typeof password !== "string" || password.length === 0 || password.length > MAX_PASSWORD) return refuse();
    const auth = createClientImpl(config.url, config.publishableKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
    if (!auth?.auth || typeof auth.auth.signInWithPassword !== "function") return refuse("FAIL");
    const result = await auth.auth.signInWithPassword({ email, password });
    const user = result?.data?.user;
    const session = result?.data?.session;
    if (result?.error || user?.id !== EXPECTED_SUBJECT || session?.user?.id !== EXPECTED_SUBJECT ||
        typeof session?.access_token !== "string" || !session.access_token) return refuse("FAIL");
    accessToken = session.access_token;
    return await verifyImpl({ allowNetwork: true, confirmedProject: "myresult", expectedProjectRef: parsed.expectedProjectRef,
      includeWildcards: parsed.includeWildcards, accessToken });
  } catch { return refuse("FAIL"); }
  finally {
    password = "";
    accessToken = "";
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  let result;
  try { result = await runAuthenticatedReaderOperator(); }
  catch { result = refuse("FAIL"); }
  console.log(JSON.stringify(result, null, 2));
  process.exitCode = result.ok ? 0 : 1;
}
