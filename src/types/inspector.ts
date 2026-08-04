export interface InspectorField {
  key: string;
  label: string;
  value: string | null;

  segment?: string;
  qualifier?: string;
  line?: number;
}

export interface InspectorSection {
  id: string;
  title: string;

  fields: InspectorField[];
}

export interface ParsedDocument {
  messageType: string;
  version: string | null;

  sections: InspectorSection[];
}