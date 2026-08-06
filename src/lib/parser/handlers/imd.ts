import { ParserContext } from "../context";

export function parseIMD(parts: string[], ctx: ParserContext) {
  if (!ctx.currentLine) {
    return;
  }

  const description = (parts[3] ?? parts[4] ?? "").replace(/^:+/, "").trim();

  ctx.currentLine.description = description || undefined;
}
