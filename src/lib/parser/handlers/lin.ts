import { ParserContext } from "../context";

export function parseLIN(parts: string[], ctx: ParserContext) {
  ctx.currentLine = {
    lineNumber: Number(parts[1] ?? ctx.lines.length + 1),
  };

  if (parts[3]) {
    ctx.currentLine.gtin = parts[3].split(":")[0];
  }

  ctx.lines.push(ctx.currentLine);

  if (ctx.currentPackage) {
    ctx.currentPackage.lines.push(ctx.currentLine);
  }
}
