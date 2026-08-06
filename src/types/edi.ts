import type { Party, Reference, DateField, Package } from "@/lib/parser/types";

export type EDIField = {
  label: string;
  value: string | null;

  segment?: string;
  qualifier?: string;
  line?: number;
};

export type EDISection = {
  id: string;
  title: string;

  fields: EDIField[];
};

export type EDILine = {
  lineNumber: number;

  gtin?: string;
  buyerArticle?: string;
  supplierArticle?: string;

  quantity?: string;
  quantityUnit?: string;

  weight?: string;
  price?: string;

  description?: string;
};

export type EDIAnalysis = {
  messageType: string;
  version: string | null;

  sections: EDISection[];

  segments: number;
  status: string;

  document: {
    number?: string;

    documentDate?: string;
    dispatchDate?: string;
    deliveryDate?: string;
  };

  references: {
    order?: string;
    deliveryNote?: string;
  };

  parties: {
    buyer?: string;
    supplier?: string;
    deliveryPoint?: string;
    invoicee?: string;
    ultimateConsignee?: string;
  };

  lines: EDILine[];

  partiesList?: Party[];

  referencesList?: Reference[];

  dates?: DateField[];

  packages?: Package[];
};
