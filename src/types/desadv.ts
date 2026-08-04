export interface DesadvDocument {
  document: {
    messageNumber: string | null;
    orderNumber: string | null;
    deliveryNote: string | null;

    despatchDate: string | null;
    deliveryDate: string | null;

    version: string | null;
  };

  parties: {
    buyer: string | null;

    supplier: string | null;

    invoiceRecipient: string | null;

    deliveryPoint: string | null;

    finalRecipient: string | null;
  };

  logistics: {
    packageCount: number;

    palletCount: number;

    ssccCount: number;

    grossWeight: number;
  };

  items: DesadvItem[];

  packages: DesadvPackage[];
}

export interface DesadvPackage {
  sscc: string;

  weight: number | null;

  type: string | null;

  items: number[];
}

export interface DesadvItem {
  line: number;

  gtin: string | null;

  supplierCode: string | null;

  buyerCode: string | null;

  description: string | null;

  quantity: number;

  freeQuantity: number;

  batch: string | null;

  expiry: string | null;

  sscc: string | null;
}