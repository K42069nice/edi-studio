export type EDIAnalysis = {
  messageType: string;
  segments: number;
  buyer: string;
};

export function parseEDI(message: string): EDIAnalysis {
  const lines = message
    .split("'")
    .map((line) => line.trim())
    .filter(Boolean);

  let messageType = "Unknown";
  let buyer = "—";

  for (const line of lines) {
    if (line.startsWith("UNH")) {
      if (line.includes("ORDERS")) messageType = "ORDERS";
      else if (line.includes("DESADV")) messageType = "DESADV";
      else if (line.includes("INVOIC")) messageType = "INVOIC";
    }

    if (line.startsWith("NAD+BY")) {
      const parts = line.split("+");

      buyer = parts[2]?.split(":")[0] ?? "—";
    }
  }

  return {
    messageType,
    segments: lines.length,
    buyer,
  };
}
