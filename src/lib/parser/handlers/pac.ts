import { ParserContext } from "../context";

export function parsePAC(parts: string[], ctx: ParserContext) {
  if (!ctx.currentPackage) return;

  ctx.currentPackage.quantity = Number(parts[1] ?? 0);

  ctx.currentPackage.packageType = parts[2]?.split(":")[0];
}
