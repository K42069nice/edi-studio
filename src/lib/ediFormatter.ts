const SEGMENT_START =
  /(UNA|UNB|UNG|UNH|BGM|DTM|RFF|NAD|CTA|COM|CUX|PAT|TOD|TDT|LOC|LIN|PIA|IMD|MEA|QTY|PRI|RNG|MOA|TAX|ALC|FTX|PAC|PCI|GIN|CPS|UNT|UNS|UNE|UNZ)\+/g;

export function normalizeEDI(content: string): string {
  return content.replace(/\r/g, "").trim();
}

export function splitSegments(content: string): string[] {
  const normalized = normalizeEDI(content);

  if (!normalized) {
    return [];
  }

  // Если документ уже красиво отформатирован,
  // просто используем строки.
  if (normalized.includes("\n")) {
    return normalized
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);
  }

  // Обычный EDIFACT
  return normalized
    .split("'")
    .map((x) => x.trim())
    .filter(Boolean)
    .map((x) => x + "'");
}
export function formatEDI(content: string): string {
  const normalized = normalizeEDI(content);

  // Уже отформатирован
  if (normalized.includes("\n")) {
    return normalized;
  }

  return splitSegments(normalized).join("\n");
}
