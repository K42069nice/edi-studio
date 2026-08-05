import { EDIAnalysis, EDIField, EDISection } from "@/types/edi";

function field(
  label: string,
  value: string | null,
  segment?: string,
  qualifier?: string
): EDIField {
  return {
    label,
    value,
    segment,
    qualifier,
  };
}

export function parseEDI(content: string): EDIAnalysis {
  const lines = content
    .split("'")
    .map((l) => l.trim())
    .filter(Boolean);

  const segments = lines.length;

  let messageType = "";
  let version: string | null = null;

  // Common
  let documentNumber: string | null = null;
  let documentDate: string | null = null;
  let currency: string | null = null;

  // Parties
  let buyer: string | null = null;
  let supplier: string | null = null;
  let deliveryPoint: string | null = null;
  let invoiceRecipient: string | null = null;

  // References
  let orderNumber: string | null = null;
  let deliveryNote: string | null = null;

  // DESADV
  let packageCount = 0;
  let palletCount = 0;
  let ssccCount = 0;
  let grossWeight: string | null = null;

  for (const line of lines) {
    const parts = line.split("+");

    switch (parts[0]) {
      case "UNH": {
        messageType = parts[2]?.split(":")[0] ?? "";
        version = parts[2]?.split(":")[2] ?? null;
        break;
      }

      case "BGM": {
        documentNumber = parts[2] ?? null;
        break;
      }

      case "DTM": {
        const values = parts[1]?.split(":");

        if (!values) break;

        if (values[0] === "137") {
          documentDate = values[1] ?? null;
        }

        break;
      }

      case "CUX": {
        currency = parts[1]?.split(":")[1] ?? null;
        break;
      }

      case "RFF": {
        const values = parts[1]?.split(":");

        if (!values) break;

        switch (values[0]) {
          case "ON":
            orderNumber = values[1] ?? null;
            break;

          case "DQ":
            deliveryNote = values[1] ?? null;
            break;
        }

        break;
      }

      case "NAD": {
        switch (parts[1]) {
          case "BY":
            buyer = parts[2] ?? null;
            break;

          case "SU":
            supplier = parts[2] ?? null;
            break;

          case "DP":
            deliveryPoint = parts[2] ?? null;
            break;

          case "IV":
            invoiceRecipient = parts[2] ?? null;
            break;
        }

        break;
      }

      case "PAC":
        packageCount++;

        if (parts[2]?.startsWith("201")) {
          palletCount++;
        }

        break;

      case "GIN":
        ssccCount++;
        break;

      case "MEA":
        grossWeight = parts[3]?.split(":")[1] ?? grossWeight;
        break;
    }
  }

  const sections: EDISection[] = [];

  switch (messageType) {
    case "INVOIC":
      sections.push({
        id: "document",
        title: "📄 Document",
        fields: [
          field("Invoice Number", documentNumber, "BGM"),
          field("Invoice Date", documentDate, "DTM", "137"),
          field("Currency", currency, "CUX"),
          field("Version", version, "UNH"),
        ],
      });

      sections.push({
        id: "parties",
        title: "👥 Parties",
        fields: [
          field("Buyer", buyer, "NAD", "BY"),
          field("Supplier", supplier, "NAD", "SU"),
        ],
      });

      break;

    case "DESADV":
      sections.push({
        id: "document",
        title: "📄 Header",
        fields: [
          field("Despatch Advice", documentNumber, "BGM"),
          field("Despatch Date", documentDate, "DTM", "137"),
          field("Order Number", orderNumber, "RFF", "ON"),
          field("Delivery Note", deliveryNote, "RFF", "DQ"),
          field("Version", version, "UNH"),
        ],
      });

      sections.push({
        id: "parties",
        title: "👥 Parties",
        fields: [
          field("Buyer", buyer, "NAD", "BY"),
          field("Supplier", supplier, "NAD", "SU"),
          field("Delivery Point", deliveryPoint, "NAD", "DP"),
          field("Invoice Recipient", invoiceRecipient, "NAD", "IV"),
        ],
      });

      sections.push({
        id: "logistics",
        title: "📦 Packaging",
        fields: [
          field("Packages", String(packageCount), "PAC"),
          field("Pallets", String(palletCount), "PAC"),
          field("SSCC Labels", String(ssccCount), "GIN"),
          field("Gross Weight", grossWeight, "MEA"),
        ],
      });

      break;
  }

  return {
    messageType,
    version,
    sections,
    segments,
    status: "OK",
  };
}