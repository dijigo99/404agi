import { config } from "./config.js";

type Level = "debug" | "info" | "warn" | "error";
const order: Record<Level, number> = { debug: 10, info: 20, warn: 30, error: 40 };

function active(level: Level): boolean {
  const min = order[(config.logLevel as Level) ?? "info"] ?? 20;
  return order[level] >= min;
}

function fmt(level: Level, msg: string, meta?: unknown): string {
  const stamp = new Date().toISOString();
  const tag = level.toUpperCase().padEnd(5);
  const tail = meta === undefined ? "" : ` ${JSON.stringify(meta)}`;
  return `${stamp} ${tag} ${msg}${tail}`;
}

export const log = {
  debug(msg: string, meta?: unknown) {
    if (active("debug")) console.log(fmt("debug", msg, meta));
  },
  info(msg: string, meta?: unknown) {
    if (active("info")) console.log(fmt("info", msg, meta));
  },
  warn(msg: string, meta?: unknown) {
    if (active("warn")) console.warn(fmt("warn", msg, meta));
  },
  error(msg: string, meta?: unknown) {
    if (active("error")) console.error(fmt("error", msg, meta));
  },
};
