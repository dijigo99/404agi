import fs from "node:fs/promises";
import path from "node:path";
import { config } from "./config.js";
import { log } from "./logger.js";

/**
 * Append-only-ish memory store. We persist the last N interactions for
 * conversational continuity, plus a small list of "milestones" that survive
 * forever (e.g. launch event, first holder, first 10x, etc.).
 *
 * Storage is a single JSON file. Cheap, serializable, easy to inspect, easy
 * to swap for Vercel KV or Redis later by reimplementing the four exported
 * functions.
 */

export type Interaction = {
  id: string;
  timestamp: string; // ISO
  channel: "x" | "tg" | "web" | "internal";
  lang: "tr" | "en";
  user?: string; // pseudonymous handle / wallet / chat id
  input: string;
  output: string;
};

export type Milestone = {
  timestamp: string;
  label: string; // short tag e.g. "launch", "first_10x"
  note: string;
};

type Store = {
  interactions: Interaction[];
  milestones: Milestone[];
  version: 1;
};

const MAX_INTERACTIONS = 50;

let cache: Store | null = null;
let writing = Promise.resolve();

async function load(): Promise<Store> {
  if (cache) return cache;
  try {
    const raw = await fs.readFile(config.paths.memory, "utf8");
    const parsed = JSON.parse(raw) as Store;
    cache = parsed;
    return parsed;
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      cache = { interactions: [], milestones: [], version: 1 };
      return cache;
    }
    log.warn("memory: failed to load store, starting fresh", { err: String(err) });
    cache = { interactions: [], milestones: [], version: 1 };
    return cache;
  }
}

async function persist(): Promise<void> {
  if (!cache) return;
  const dir = path.dirname(config.paths.memory);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(config.paths.memory, JSON.stringify(cache, null, 2), "utf8");
}

export async function recordInteraction(i: Omit<Interaction, "id" | "timestamp"> & {
  id?: string;
  timestamp?: string;
}): Promise<Interaction> {
  const store = await load();
  const entry: Interaction = {
    id: i.id ?? cryptoRandomId(),
    timestamp: i.timestamp ?? new Date().toISOString(),
    channel: i.channel,
    lang: i.lang,
    user: i.user,
    input: i.input,
    output: i.output,
  };
  store.interactions.push(entry);
  if (store.interactions.length > MAX_INTERACTIONS) {
    store.interactions.splice(0, store.interactions.length - MAX_INTERACTIONS);
  }
  writing = writing.then(persist);
  await writing;
  return entry;
}

export async function recentInteractions(limit = 10): Promise<Interaction[]> {
  const store = await load();
  return store.interactions.slice(-limit);
}

export async function recordMilestone(m: Omit<Milestone, "timestamp">): Promise<Milestone> {
  const store = await load();
  const entry: Milestone = { timestamp: new Date().toISOString(), ...m };
  store.milestones.push(entry);
  writing = writing.then(persist);
  await writing;
  return entry;
}

export async function getMilestones(): Promise<Milestone[]> {
  const store = await load();
  return [...store.milestones];
}

function cryptoRandomId(): string {
  // Node 20 has globalThis.crypto.randomUUID
  return (globalThis.crypto?.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
}
