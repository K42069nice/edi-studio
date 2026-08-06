import { ParserContext } from "../context";
import { cleanParty } from "../helpers";

export function parseNAD(parts: string[], ctx: ParserContext) {
  switch (parts[1]) {
    case "BY":
      ctx.buyer = cleanParty(parts[2] ?? null);
      if (ctx.buyer) {
        ctx.partiesList.push({
          qualifier: "BY",
          label: "Buyer",
          id: ctx.buyer,
          segment: "NAD+BY",
        });
      }
      break;

    case "SU":
      ctx.supplier = cleanParty(parts[2] ?? null);
      if (ctx.supplier) {
        ctx.partiesList.push({
          qualifier: "SU",
          label: "Supplier",
          id: ctx.supplier,
          segment: "NAD+SU",
        });
      }
      break;

    case "DP":
      ctx.deliveryPoint = cleanParty(parts[2] ?? null);
      if (ctx.deliveryPoint) {
        ctx.partiesList.push({
          qualifier: "DP",
          label: "Delivery Point",
          id: ctx.deliveryPoint,
          segment: "NAD+DP",
        });
      } 
      break;

    case "IV":
      ctx.invoiceRecipient = cleanParty(parts[2] ?? null);
      if (ctx.invoiceRecipient) {
        ctx.partiesList.push({
          qualifier: "IV",
          label: "Invoice Recipient",
          id: ctx.invoiceRecipient,
          segment: "NAD+IV",
        });
      } 
      break;
  }
}
