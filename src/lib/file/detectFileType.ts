import { LoadedFile } from "@/types/file";

export function detectFileType(content: string): LoadedFile["type"] {
  const text = content.trim();

  if (
    text.startsWith("UNB") ||
    text.startsWith("UNA") ||
    text.startsWith("UNH")
  ) {
    return "EDIFACT";
  }

  if (text.startsWith("<?xml")) {
    return "XML";
  }

  if (text.startsWith("{") || text.startsWith("[")) {
    return "JSON";
  }

  return "UNKNOWN";
}
