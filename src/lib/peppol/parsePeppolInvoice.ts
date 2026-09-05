import {
  PeppolInvoiceAnalysis,
  PeppolInvoiceLine,
  PeppolParty,
  PeppolVatBreakdown,
} from "@/types/peppol";

function directChildText(
  parent: Element | null,
  localName: string,
): string | undefined {
  if (!parent) return undefined;

  const child = Array.from(parent.children).find(
    (element) => element.localName === localName,
  );

  return child?.textContent?.trim() || undefined;
}

function firstDescendant(
  parent: Element | Document | null,
  localName: string,
): Element | null {
  if (!parent) return null;

  return Array.from(parent.getElementsByTagNameNS("*", localName))[0] ?? null;
}

function descendantText(
  parent: Element | Document | null,
  localName: string,
): string | undefined {
  return firstDescendant(parent, localName)?.textContent?.trim() || undefined;
}

function parseParty(container: Element | null): PeppolParty {
  const party = firstDescendant(container, "Party");

  if (!party) {
    return {};
  }

  const endpoint = firstDescendant(party, "EndpointID");
  const postalAddress = firstDescendant(party, "PostalAddress");
  const taxScheme = firstDescendant(party, "PartyTaxScheme");
  const legalEntity = firstDescendant(party, "PartyLegalEntity");
  const partyName = firstDescendant(party, "PartyName");

  return {
    name:
      directChildText(legalEntity, "RegistrationName") ??
      directChildText(partyName, "Name"),

    vatId: directChildText(taxScheme, "CompanyID"),

    endpointId: endpoint?.textContent?.trim() || undefined,
    endpointScheme: endpoint?.getAttribute("schemeID") || undefined,

    street: directChildText(postalAddress, "StreetName"),
    city: directChildText(postalAddress, "CityName"),
    postalCode: directChildText(postalAddress, "PostalZone"),
    country: descendantText(postalAddress, "IdentificationCode"),
  };
}

export function parsePeppolInvoice(
  content: string,
): PeppolInvoiceAnalysis | null {
  try {
    const parser = new DOMParser();

    const document = parser.parseFromString(content, "application/xml");

    if (document.querySelector("parsererror")) {
      return null;
    }

    const root = document.documentElement;

    if (root.localName !== "Invoice") {
      return null;
    }

    const customizationId = directChildText(root, "CustomizationID");

    /*
     * We accept a UBL Invoice here even if the Peppol identifier
     * is absent. Later we can distinguish generic UBL from Peppol
     * more strictly.
     */

    const supplierContainer = firstDescendant(root, "AccountingSupplierParty");

    const customerContainer = firstDescendant(root, "AccountingCustomerParty");

    const orderReference = firstDescendant(root, "OrderReference");

    const paymentMeans = firstDescendant(root, "PaymentMeans");

    const financialAccount = firstDescendant(
      paymentMeans,
      "PayeeFinancialAccount",
    );

    const taxTotal = firstDescendant(root, "TaxTotal");

    const legalTotal = firstDescendant(root, "LegalMonetaryTotal");

    const vatBreakdown: PeppolVatBreakdown[] = Array.from(
      root.getElementsByTagNameNS("*", "TaxSubtotal"),
    ).map((subtotal) => {
      const category = firstDescendant(subtotal, "TaxCategory");

      return {
        category: directChildText(category, "ID"),
        rate: directChildText(category, "Percent"),

        taxableAmount: directChildText(subtotal, "TaxableAmount"),

        taxAmount: directChildText(subtotal, "TaxAmount"),
      };
    });

    const lines: PeppolInvoiceLine[] = Array.from(
      root.getElementsByTagNameNS("*", "InvoiceLine"),
    ).map((line) => {
      const quantity = firstDescendant(line, "InvoicedQuantity");

      const item = firstDescendant(line, "Item");

      const sellerIdentification = firstDescendant(
        item,
        "SellersItemIdentification",
      );

      const taxCategory = firstDescendant(item, "ClassifiedTaxCategory");

      const price = firstDescendant(line, "Price");

      return {
        id: directChildText(line, "ID"),

        name: directChildText(item, "Name"),

        sellerItemId: directChildText(sellerIdentification, "ID"),

        quantity: quantity?.textContent?.trim() || undefined,

        unitCode: quantity?.getAttribute("unitCode") || undefined,

        price: directChildText(price, "PriceAmount"),

        netAmount: directChildText(line, "LineExtensionAmount"),

        vatRate: directChildText(taxCategory, "Percent"),
      };
    });

    return {
      documentType: "PEPPOL_INVOICE",

      ublVersion: directChildText(root, "UBLVersionID"),
      customizationId,
      profileId: directChildText(root, "ProfileID"),

      invoiceNumber: directChildText(root, "ID"),

      invoiceTypeCode: directChildText(root, "InvoiceTypeCode"),

      issueDate: directChildText(root, "IssueDate"),
      dueDate: directChildText(root, "DueDate"),

      currency: directChildText(root, "DocumentCurrencyCode"),

      buyerReference: directChildText(root, "BuyerReference"),

      orderReference: directChildText(orderReference, "ID"),

      supplier: parseParty(supplierContainer),
      customer: parseParty(customerContainer),

      paymentMeansCode: directChildText(paymentMeans, "PaymentMeansCode"),

      paymentReference: directChildText(paymentMeans, "PaymentID"),

      iban: directChildText(financialAccount, "ID"),

      netAmount: directChildText(legalTotal, "LineExtensionAmount"),

      taxExclusiveAmount: directChildText(legalTotal, "TaxExclusiveAmount"),

      taxAmount: directChildText(taxTotal, "TaxAmount"),

      taxInclusiveAmount: directChildText(legalTotal, "TaxInclusiveAmount"),

      payableAmount: directChildText(legalTotal, "PayableAmount"),

      vatBreakdown,
      lines,
    };
  } catch {
    return null;
  }
}
