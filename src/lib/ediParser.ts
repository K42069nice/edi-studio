import { EDIAnalysis, EDIField } from "@/types/edi";

export function parseEDI(message: string): EDIAnalysis {
  const lines = message
    .split("'")
    .map((line) => line.trim())
    .filter(Boolean);

  let messageType: EDIField | null = null;
  let version: EDIField | null = null;
  let buyer: EDIField | null = null;
  let supplier: EDIField | null = null;
  let documentNumber: EDIField | null = null;
  let documentDate: EDIField | null = null;
  let currency: EDIField | null = null;

  for (const line of lines) {
    if (line.startsWith("UNH")) {
      const parts = line.split("+");
      const type = parts[2]?.split(":");

      messageType = {
        value: type?.[0] ?? "",
        segment: "UNH",
      };

      version = {
        value: type?.[2] ?? "",
        segment: "UNH",
      };
    }

    if (line.startsWith("BGM")) {
      const parts = line.split("+");

      documentNumber = {
        value: parts[2] ?? "",
        segment: "BGM",
      };
    }

    if (line.startsWith("DTM+137")) {
      const parts = line.split("+");

      documentDate = {
        value: parts[1]?.split(":")[1] ?? "",
        segment: "DTM+137",
      };
    }

    if (line.startsWith("NAD+BY")) {
      const parts = line.split("+");

      buyer = {
        value: parts[2]?.split(":")[0] ?? "",
        segment: "NAD+BY",
      };
    }

    if (line.startsWith("NAD+SU")) {
      const parts = line.split("+");

      supplier = {
        value: parts[2]?.split(":")[0] ?? "",
        segment: "NAD+SU",
      };
    }

    if (line.startsWith("CUX")) {
      const parts = line.split("+");

      currency = {
        value: parts[1]?.split(":")[1] ?? "",
        segment: "CUX",
      };
    }
  }

  return {
    messageType,
    version,
    buyer,
    supplier,
    documentNumber,
    documentDate,
    currency,
    segments: lines.length,
    status: lines.length > 0 ? "Valid" : "",
  };
}