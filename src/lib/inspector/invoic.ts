import { EDISection } from "@/types/edi";

export function createInvoiceSections(): EDISection[] {
  return [
    {
      id: "document",
      title: "📄 Document",
      fields: [],
    },
    {
      id: "parties",
      title: "👥 Parties",
      fields: [],
    },
    {
      id: "references",
      title: "📑 References",
      fields: [],
    },
    {
      id: "delivery",
      title: "🚚 Delivery",
      fields: [],
    },
    {
      id: "payment",
      title: "💳 Payment",
      fields: [],
    },
    {
      id: "totals",
      title: "💰 Totals",
      fields: [],
    },
    {
      id: "summary",
      title: "📊 Summary",
      fields: [],
    },
  ];
}