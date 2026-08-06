import { ParserContext } from "../context";

export function parseRFF(parts: string[], ctx: ParserContext) {
  const values = parts[1]?.split(":");

  if (!values) {
    return;
  }

  switch (values[0]) {
    case "ON":
      ctx.orderNumber = values[1] ?? null;
      ctx.referencesList.push({
        qualifier: "ON",
        label: "Order",
        value: ctx.orderNumber,
        segment: "RFF+ON",
      });
      break;

    case "DQ":
      ctx.deliveryNote = values[1] ?? null;
      ctx.referencesList.push({
        qualifier: "DQ",
        label: "Delivery Note",
        value: ctx.deliveryNote,
        segment: "RFF+DQ",
      });
      break;
  }
}
