import { ParserContext } from "../context";
import { formatDate } from "../helpers";

export function parseDTM(parts: string[], ctx: ParserContext) {
  const values = parts[1]?.split(":");

  if (!values) return;

  switch (values[0]) {
    case "137":
      ctx.documentDate = formatDate(values[1] ?? null);
      ctx.dates.push({
        qualifier: "137",
        label: "Document Date",
        value: ctx.documentDate!,
        segment: "DTM+137",
      });
      break;

    case "11":
      ctx.dispatchDate = formatDate(values[1] ?? null);
      ctx.dates.push({
        qualifier: "11",
        label: "Dispatch Date",
        value: ctx.dispatchDate!,
        segment: "DTM+11",
      });
      break;

    case "17":
      ctx.deliveryDate = formatDate(values[1] ?? null);
      ctx.dates.push({
        qualifier: "17",
        label: "Delivery Date",
        value: ctx.deliveryDate!,
        segment: "DTM+17",
      });
      break;
  }
}
