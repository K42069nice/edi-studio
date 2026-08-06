export type DocumentField = {
  label: string;
  value: string;

  segment: string;

  line?: number;
};

export type Party = {
  qualifier: string;

  label: string;

  id: string;

  segment: string;

  line?: number;
};

export type Reference = {
  qualifier: string;

  label: string;

  value: string;

  segment: string;

  line?: number;
};

export type DateField = {
  qualifier: string;

  label: string;

  value: string;

  segment: string;

  line?: number;
};

export type LineItem = {
  lineNumber: number;

  segment: string;

  gtin?: string;

  buyerArticle?: string;

  supplierArticle?: string;

  description?: string;

  quantity?: string;

  quantityUnit?: string;

  weight?: string;

  price?: string;
};

export type Package = {
  level: number;

  sscc?: string;

  packageType?: string;

  weight?: string;

  dimensions?: string;

  lines: LineItem[];
};
