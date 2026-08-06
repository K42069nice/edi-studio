import { ParserContext } from "../context";

export function parsePIA(parts: string[], ctx: ParserContext) {
  if (!ctx.currentLine) return;

  const qualifier = parts[1];
  const article = parts[2]?.split(":")[0];

  if (!article) return;

  switch (qualifier) {
    case "BP":
      ctx.currentLine.buyerArticle = article;
      break;

    case "SA":
      ctx.currentLine.supplierArticle = article;
      break;
  }
}
