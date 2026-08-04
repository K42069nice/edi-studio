export interface ParsedValue {
  value: string | null;

  segment: string;

  qualifier?: string;

  line?: number;
}

export interface InvoiceData {
  document: {
    number?: ParsedValue;
    type?: ParsedValue;
    date?: ParsedValue;
    dueDate?: ParsedValue;
    currency?: ParsedValue;
    version?: ParsedValue;
  };

  parties: {
    buyer?: ParsedValue;
    supplier?: ParsedValue;
    invoicee?: ParsedValue;
    deliveryParty?: ParsedValue;
    payer?: ParsedValue;
  };

  references: {
    purchaseOrder?: ParsedValue;
    contract?: ParsedValue;
    deliveryNote?: ParsedValue;
    customerReference?: ParsedValue;
  };

  payment: {
    terms?: ParsedValue;
    means?: ParsedValue;
  };

  totals: {
    net?: ParsedValue;
    tax?: ParsedValue;
    gross?: ParsedValue;
    payable?: ParsedValue;
  };

  summary: {
    segments: number;
  };
}