export type PeppolField = {
  label: string;
  value: string;
};

export type PeppolParty = {
  name?: string;
  vatId?: string;
  endpointId?: string;
  endpointScheme?: string;
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
};

export type PeppolVatBreakdown = {
  category?: string;
  rate?: string;
  taxableAmount?: string;
  taxAmount?: string;
};

export type PeppolInvoiceLine = {
  id?: string;
  name?: string;
  sellerItemId?: string;
  quantity?: string;
  unitCode?: string;
  price?: string;
  netAmount?: string;
  vatRate?: string;
};

export type PeppolInvoiceAnalysis = {
  documentType: "PEPPOL_INVOICE";

  ublVersion?: string;
  customizationId?: string;
  profileId?: string;

  invoiceNumber?: string;
  invoiceTypeCode?: string;
  issueDate?: string;
  dueDate?: string;
  currency?: string;

  buyerReference?: string;
  orderReference?: string;

  supplier: PeppolParty;
  customer: PeppolParty;

  paymentMeansCode?: string;
  paymentReference?: string;
  iban?: string;

  netAmount?: string;
  taxExclusiveAmount?: string;
  taxAmount?: string;
  taxInclusiveAmount?: string;
  payableAmount?: string;

  vatBreakdown: PeppolVatBreakdown[];

  lines: PeppolInvoiceLine[];
};
