import { ParserContext } from "../context";

export function parseIMD(parts: string[], ctx: ParserContext) {
  if (!ctx.currentLine) return;

  ctx.currentLine.description = parts[3] ?? parts[4] ?? undefined;
}
