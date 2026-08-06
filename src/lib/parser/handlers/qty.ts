import { ParserContext } from "../context";

export function parseQTY(parts: string[], ctx: ParserContext) {
  if (!ctx.currentLine) return;

  const values = parts[1]?.split(":");

  if (!values) return;

  ctx.currentLine.quantity = values[1];
  ctx.currentLine.quantityUnit = values[2];
}
