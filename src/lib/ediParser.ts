import { EDIAnalysis, EDIField, EDISection, EDILine } from "@/types/edi";
import { createParserContext } from "@/lib/parser/context";
import { parseUNH } from "@/lib/parser/handlers/unh";
import { parseBGM } from "@/lib/parser/handlers/bgm";
import { parseDTM } from "@/lib/parser/handlers/dtm";
import { parseNAD } from "@/lib/parser/handlers/nad";
import { parseRFF } from "@/lib/parser/handlers/rff";
import { parseLIN } from "@/lib/parser/handlers/lin";
import { parsePIA } from "@/lib/parser/handlers/pia";
import { parseQTY } from "@/lib/parser/handlers/qty";
import { parseMEA } from "@/lib/parser/handlers/mea";
import { parsePRI } from "@/lib/parser/handlers/pri";
import { parseIMD } from "@/lib/parser/handlers/imd";
import { parseCPS } from "@/lib/parser/handlers/cps";
import { parseGIN } from "@/lib/parser/handlers/gin";

function formatDate(value: string | null): string | null {
  if (!value || value.length !== 8) {
    return value;
  }

  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(4, 6)) - 1;
  const day = Number(value.slice(6, 8));

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(year, month, day));
}

function cleanParty(value: string | null): string | null {
  if (!value) {
    return null;
  }

  return value.replace(/::9$/, "");
}

function field(
  label: string,
  value: string | null,
  segment?: string,
  qualifier?: string,
): EDIField {
  return {
    label,
    value,
    segment,
    qualifier,
  };
}

export function parseEDI(content: string): EDIAnalysis {
  const segmentsList = content
    .split("'")
    .map((l) => l.trim())
    .filter(Boolean);
  const segments = segmentsList.length;

  let messageType = "";
  let version: string | null = null;

  // Common
  let documentNumber: string | null = null;
  let documentDate: string | null = null;
  let dispatchDate: string | null = null;
  let deliveryDate: string | null = null;
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

  // Lines
  let lines: EDILine[] = [];
  let currentLine: EDILine | null = null;

  const ctx = createParserContext();

  for (const line of segmentsList) {
    const parts = line.split("+");

    switch (parts[0]) {
      case "UNH": {
        parseUNH(parts, ctx);
        break;
      }

      case "BGM": {
        parseBGM(parts, ctx);
        break;
      }

      case "DTM": {
        parseDTM(parts, ctx);
        break;
      }

      case "CUX": {
        currency = parts[1]?.split(":")[1] ?? null;
        break;
      }

      case "RFF": {
        parseRFF(parts, ctx);
        break;
      }

      case "NAD": {
        parseNAD(parts, ctx);
        break;
      }

      case "CPS": {
        parseCPS(parts, ctx);
        break;
      }

      case "PAC":
        packageCount++;

        if (parts[2]?.startsWith("201")) {
          palletCount++;
        }

        break;

      case "GIN":
        parseGIN(parts, ctx);
        break;

      case "LIN": {
        parseLIN(parts, ctx);
        break;
      }

      case "PIA": {
        parsePIA(parts, ctx);
        break;
      }

      case "IMD": {
        parseIMD(parts, ctx);
        break;
      }

      case "QTY": {
        parseQTY(parts, ctx);
        break;
      }

      case "MEA": {
        parseMEA(parts, ctx);
        break;
      }

      case "PRI": {
        parsePRI(parts, ctx);
        break;
      }
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
          field("Document Date", documentDate, "DTM", "137"),
          field("Dispatch Date", dispatchDate, "DTM", "11"),
          field("Delivery Date", deliveryDate, "DTM", "17"),
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

  messageType = ctx.messageType;
  version = ctx.version;

  documentNumber = ctx.documentNumber;
  documentDate = ctx.documentDate;
  dispatchDate = ctx.dispatchDate;
  deliveryDate = ctx.deliveryDate;

  buyer = ctx.buyer;
  supplier = ctx.supplier;
  deliveryPoint = ctx.deliveryPoint;
  invoiceRecipient = ctx.invoiceRecipient;

  orderNumber = ctx.orderNumber;
  deliveryNote = ctx.deliveryNote;

  lines = ctx.lines;
  grossWeight = ctx.grossWeight;

  return {
    messageType,
    version,
    sections,
    segments,
    status: "OK",

    document: {
      number: documentNumber ?? undefined,
      documentDate: documentDate ?? undefined,
      dispatchDate: dispatchDate ?? undefined,
      deliveryDate: deliveryDate ?? undefined,
    },

    references: {
      order: orderNumber ?? undefined,
      deliveryNote: deliveryNote ?? undefined,
    },

    parties: {
      buyer: buyer ?? undefined,
      supplier: supplier ?? undefined,
      deliveryPoint: deliveryPoint ?? undefined,
      invoicee: invoiceRecipient ?? undefined,
    },

    lines,

    partiesList: ctx.partiesList,

    referencesList: ctx.referencesList,

    dates: ctx.dates,

    packages: ctx.packages,
  };
}
