import { ParserContext } from "../context";

export function parseCPS(parts: string[], ctx: ParserContext) {
  const cps = Number(parts[1]);
  const parentCps = parts[2] ? Number(parts[2]) : undefined;

  const pkg = {
    id: ctx.nextPackageId++,

    cps,
    parentCps,

    level: parentCps ? 2 : 1,

    lines: [],
    children: [],
  };

  ctx.packageMap.set(cps, pkg);

  if (parentCps != null) {
    const parent = ctx.packageMap.get(parentCps);

    if (parent) {
      parent.children.push(pkg);
    } else {
      ctx.packages.push(pkg);
    }
  } else {
    ctx.packages.push(pkg);
  }

  ctx.currentPackage = pkg;
}
