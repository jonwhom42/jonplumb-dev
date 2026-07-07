import { describe, expect, it } from "vitest";
import {
  capsFromEnv,
  checkAndCount,
  countClaudeCall,
  dayKey,
  hashIp,
  type CounterStore,
} from "../netlify/functions/lib/limits";

function fakeStore(initial: Record<string, string> = {}): CounterStore & {
  data: Map<string, string>;
} {
  const data = new Map(Object.entries(initial));
  return {
    data,
    async get(key) {
      return data.get(key) ?? null;
    },
    async set(key, value) {
      data.set(key, value);
    },
  };
}

const CAPS = { global: 3, claude: 2, ip: 2 };
const NOW = new Date("2026-07-06T15:00:00Z");

describe("dayKey", () => {
  it("uses the UTC day", () => {
    expect(dayKey(new Date("2026-07-06T23:59:59Z"))).toBe("2026-07-06");
    expect(dayKey(new Date("2026-07-07T00:00:01Z"))).toBe("2026-07-07");
  });
});

describe("capsFromEnv", () => {
  it("falls back to defaults on missing/garbage values", () => {
    expect(capsFromEnv({})).toEqual({ global: 300, claude: 200, ip: 40 });
    expect(capsFromEnv({ CONCIERGE_GLOBAL_CAP: "nope" }).global).toBe(300);
    expect(capsFromEnv({ CONCIERGE_IP_CAP: "-5" }).ip).toBe(40);
  });

  it("reads overrides", () => {
    expect(capsFromEnv({ CONCIERGE_GLOBAL_CAP: "10" }).global).toBe(10);
  });
});

describe("checkAndCount", () => {
  it("allows and increments under the caps", async () => {
    const store = fakeStore();
    const d = await checkAndCount(store, "1.2.3.4", CAPS, NOW);
    expect(d.allowed).toBe(true);
    expect(d.claudeBudgetAvailable).toBe(true);
    expect(store.data.get("global:2026-07-06")).toBe("1");
    expect(store.data.get(`ip:${hashIp("1.2.3.4")}:2026-07-06`)).toBe("1");
  });

  it("blocks when the global cap is reached", async () => {
    const store = fakeStore({ "global:2026-07-06": "3" });
    const d = await checkAndCount(store, "1.2.3.4", CAPS, NOW);
    expect(d).toMatchObject({ allowed: false, reason: "global" });
  });

  it("blocks a chatty IP without blocking others", async () => {
    const store = fakeStore({ [`ip:${hashIp("1.2.3.4")}:2026-07-06`]: "2" });
    const blocked = await checkAndCount(store, "1.2.3.4", CAPS, NOW);
    expect(blocked).toMatchObject({ allowed: false, reason: "ip" });
    const other = await checkAndCount(store, "5.6.7.8", CAPS, NOW);
    expect(other.allowed).toBe(true);
  });

  it("marks the claude fallback unavailable when its budget is spent (not an error)", async () => {
    const store = fakeStore({ "claude:2026-07-06": "2" });
    const d = await checkAndCount(store, "1.2.3.4", CAPS, NOW);
    expect(d.allowed).toBe(true);
    expect(d.claudeBudgetAvailable).toBe(false);
  });

  it("fails open when the store errors", async () => {
    const broken: CounterStore = {
      get: async () => {
        throw new Error("blobs down");
      },
      set: async () => {
        throw new Error("blobs down");
      },
    };
    const d = await checkAndCount(broken, "1.2.3.4", CAPS, NOW);
    expect(d.allowed).toBe(true);
  });

  it("does not store raw IPs", async () => {
    const store = fakeStore();
    await checkAndCount(store, "203.0.113.99", CAPS, NOW);
    expect([...store.data.keys()].join()).not.toContain("203.0.113.99");
  });
});

describe("countClaudeCall", () => {
  it("increments the daily claude counter", async () => {
    const store = fakeStore();
    await countClaudeCall(store, NOW);
    await countClaudeCall(store, NOW);
    expect(store.data.get("claude:2026-07-06")).toBe("2");
  });
});
