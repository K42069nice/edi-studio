import { ParserContext } from "../context";

export function parseBGM(parts: string[], ctx: ParserContext) {
  ctx.documentNumber = parts[2] ?? null;
}
