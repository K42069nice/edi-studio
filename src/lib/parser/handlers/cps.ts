import { ParserContext } from "../context";

export function parseCPS(parts: string[], ctx: ParserContext) {
  const level = Number(parts[1] ?? ctx.packages.length + 1);

  ctx.currentPackage = {
    level,
    lines: [],
  };

  ctx.packages.push(ctx.currentPackage);
}
