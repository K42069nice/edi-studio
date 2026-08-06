import { Package } from "@/lib/parser/types";
import { EDILine } from "@/types/edi";

export type TreeNodeType = "package" | "line";

export type TreeNode = {
  id: string;

  type: TreeNodeType;

  title: string;

  subtitle?: string;

  badge?: string;

  children: TreeNode[];

  data: Package | EDILine;
};
