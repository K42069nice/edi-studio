export type LoadedFile = {
  name: string;
  type: "EDIFACT" | "XML" | "JSON" | "UNKNOWN";
  size: number;
};
