import { EDIField } from "./edi";

export type WorkspaceNodeType = "document" | "package" | "line" | "group";

export type WorkspaceNode = {
  id: string;

  type: WorkspaceNodeType;

  title: string;

  subtitle?: string;

  icon?: string;

  fields: EDIField[];

  children: WorkspaceNode[];
};
