import { ParserContext } from "../context";

export function parseGIN(parts: string[], ctx: ParserContext) {
  if (ctx.currentPackage && parts[1] === "BJ") {
    ctx.currentPackage.sscc = parts[2];
  }

  ctx.ssccCount++;
}
