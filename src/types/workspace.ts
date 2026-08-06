import { EDIField, EDILine } from "./edi";
import { Package } from "@/lib/parser/types";

export type WorkspaceNodeType = "document" | "package" | "line" | "group";

export type WorkspaceNode = {
  id: string;

  type: WorkspaceNodeType;

  title: string;

  subtitle?: string;

  badge?: string;

  fields: EDIField[];

  children: WorkspaceNode[];

  data?: Package | EDILine;
};
