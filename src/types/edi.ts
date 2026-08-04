export type EDIField = {
  value: string;
  segment: string;
};

export type EDIAnalysis = {
  messageType: EDIField | null;
  version: EDIField | null;
  buyer: EDIField | null;
  supplier: EDIField | null;
  documentNumber: EDIField | null;
  documentDate: EDIField | null;
  currency: EDIField | null;

  segments: number;
  status: string;
};