import { ParserContext } from "../context";

export function parseCPS(parts: string[], ctx: ParserContext) {
  const level = Number(parts[1]);

  while (
    ctx.packageStack.length &&
    ctx.packageStack[ctx.packageStack.length - 1].level >= level
  ) {
    ctx.packageStack.pop();
  }

  const parent = ctx.packageStack.at(-1);

  const pkg = {
    id: ctx.nextPackageId++,
    level,
    parentId: parent?.id,
    lines: [],
    children: [],
  };

  if (parent) {
    parent.children.push(pkg);
  } else {
    ctx.packages.push(pkg);
  }

  ctx.packageStack.push(pkg);
  ctx.currentPackage = pkg;
}
