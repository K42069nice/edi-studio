import { EDIAnalysis } from "@/types/edi";

export function parseOrderResponse(content: string): EDIAnalysis {
  return {
    messageType: "ORDRSP",
    version: null,
    sections: [],
    segments: 0,
    status: "Not implemented",
  };
}