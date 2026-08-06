import { parseInvoice } from "./invoice";

import { EDIAnalysis } from "@/types/edi";

export function parseDocument(
  messageType: string,
  content: string,
): EDIAnalysis {
  switch (messageType) {
    case "INVOIC":
      return parseInvoice(content);

    default:
      return {
        messageType,
        version: null,

        sections: [],

        segments: 0,
        status: "Unsupported message type",

        document: {},

        references: {},

        parties: {},

        lines: [],

        partiesList: [],

        referencesList: [],

        dates: [],

        packages: [],

        workspace: [],
      };
  }
}
