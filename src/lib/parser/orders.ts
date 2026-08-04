import { EDIAnalysis } from "@/types/edi";

export function parseOrders(content: string): EDIAnalysis {
  return {
    messageType: "ORDERS",
    version: null,
    sections: [],
    segments: 0,
    status: "Not implemented",
  };
}