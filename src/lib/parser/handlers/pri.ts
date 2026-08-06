import { ParserContext } from "../context";

export function parsePRI(parts: string[], ctx: ParserContext) {
  if (!ctx.currentLine) return;

  ctx.currentLine.price = parts[1]?.split(":")[1];
}
