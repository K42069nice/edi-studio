import { ParserContext } from "../context";

export function parseUNH(parts: string[], ctx: ParserContext) {
  ctx.messageType = parts[2]?.split(":")[0] ?? "";
  ctx.version = parts[2]?.split(":")[2] ?? null;
}