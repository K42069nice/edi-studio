import { ParserContext } from "../context";

export function parseMEA(parts: string[], ctx: ParserContext) {
  if (ctx.currentLine) {
    ctx.currentLine.weight = parts[3]?.split(":")[1];
    return;
  }

  ctx.grossWeight = parts[3]?.split(":")[1] ?? ctx.grossWeight;
}
