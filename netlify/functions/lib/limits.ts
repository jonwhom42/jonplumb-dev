/**
 * Rate limiting & daily budget caps via Netlify Blobs counters.
 *
 * Design notes:
 * - Read-increment-write with NO atomicity. Concurrent requests can undercount
 *   by a few — acceptable: these are cost fences, not billing.
 * - Counters are keyed by UTC day, so they reset structurally at midnight UTC.
 * - Fail-open: if Blobs errors, log and allow the request. Availability beats
 *   strictness for a portfolio widget.
 * - IPs are hashed before storage — no raw PII at rest.
 */

import { createHash } from "node:crypto";

/** Minimal slice of the Netlify Blobs store we use — injectable for tests. */
export interface CounterStore {
  get(key: string, opts: { type: "text" }): Promise<string | null>;
  set(key: string, value: string): Promise<unknown>;
}

export interface Caps {
  global: number;
  claude: number;
  ip: number;
}

export function capsFromEnv(env: Record<string, string | undefined>): Caps {
  const num = (v: string | undefined, fallback: number) => {
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
  };
  return {
    global: num(env.CONCIERGE_GLOBAL_CAP, 300),
    claude: num(env.CLAUDE_DAILY_CAP, 200),
    // 40/day: corporate NAT means several recruiters can share one IP
    ip: num(env.CONCIERGE_IP_CAP, 40),
  };
}

/** UTC day key, e.g. "2026-07-06". */
export function dayKey(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

export function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

async function readCount(store: CounterStore, key: string): Promise<number> {
  const raw = await store.get(key, { type: "text" });
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export type LimitDecision = {
  allowed: boolean;
  /** which fence tripped, when not allowed */
  reason?: "global" | "ip";
  /** whether the Claude fallback's daily budget still has room */
  claudeBudgetAvailable: boolean;
};

/**
 * Check all fences and, when the request is allowed, increment the counters.
 * Fail-open on storage errors.
 */
export async function checkAndCount(
  store: CounterStore,
  ip: string,
  caps: Caps,
  now: Date = new Date()
): Promise<LimitDecision> {
  const day = dayKey(now);
  const globalKey = `global:${day}`;
  const ipKey = `ip:${hashIp(ip)}:${day}`;
  const claudeKey = `claude:${day}`;

  try {
    const [globalCount, ipCount, claudeCount] = await Promise.all([
      readCount(store, globalKey),
      readCount(store, ipKey),
      readCount(store, claudeKey),
    ]);

    if (globalCount >= caps.global) {
      return { allowed: false, reason: "global", claudeBudgetAvailable: false };
    }
    if (ipCount >= caps.ip) {
      return { allowed: false, reason: "ip", claudeBudgetAvailable: false };
    }

    await Promise.all([
      store.set(globalKey, String(globalCount + 1)),
      store.set(ipKey, String(ipCount + 1)),
    ]);

    return { allowed: true, claudeBudgetAvailable: claudeCount < caps.claude };
  } catch (err) {
    console.error("limits: blobs unavailable, failing open", err);
    return { allowed: true, claudeBudgetAvailable: true };
  }
}

/** Record one successful Claude fallback call against its daily budget. */
export async function countClaudeCall(
  store: CounterStore,
  now: Date = new Date()
): Promise<void> {
  const key = `claude:${dayKey(now)}`;
  try {
    const n = await readCount(store, key);
    await store.set(key, String(n + 1));
  } catch (err) {
    console.error("limits: failed to count claude call", err);
  }
}
