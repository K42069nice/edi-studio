import { Package, LineItem } from "@/lib/parser/types";
import { TreeNode } from "@/types/tree";

import { EDILine } from "@/types/edi";

export function buildTree(
  messageType: string,
  packages: Package[],
  lines: EDILine[],
): TreeNode[] {
  if (messageType === "DESADV") {
    return packages.map(toPackageNode);
  }

  return lines.map(toLineNode);
}

function toPackageNode(pkg: Package): TreeNode {
  return {
    id: `pkg-${pkg.id}`,

    type: "package",

    title: packageTitle(pkg),

    subtitle: pkg.sscc ?? "No SSCC",

    badge: pkg.packageType,

    data: pkg,

    children: [
      ...pkg.children.map(toPackageNode),

      ...pkg.lines.map(toLineNode),
    ],
  };
}

function toLineNode(line: LineItem | EDILine): TreeNode {
  return {
    id: `line-${line.lineNumber}`,

    type: "line",

    title: `Line ${line.lineNumber}`,

    subtitle: line.description ?? line.gtin ?? "Unknown product",

    data: line,

    children: [],
  };
}
function packageTitle(pkg: Package) {
  switch (pkg.packageType) {
    case "201":
      return "Pallet";

    case "CT":
      return "Carton";

    default:
      return "Package";
  }
}
