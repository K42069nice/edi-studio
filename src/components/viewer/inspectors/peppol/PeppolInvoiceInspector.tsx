"use client";

import { PeppolInvoiceAnalysis } from "@/types/peppol";

import InspectorSection from "../shared/InspectorSection";
import FieldCard from "../shared/FieldCard";

type Props = {
  analysis: PeppolInvoiceAnalysis;
};

export default function PeppolInvoiceInspector({
  analysis,
}: Props) {
  const currency = analysis.currency ?? "";

  const endpoint = (
    scheme?: string,
    id?: string,
  ) => {
    if (!id) return undefined;

    return scheme ? `${scheme}:${id}` : id;
  };

  return (
    <div className="space-y-4">
      {/* SUMMARY */}

      <div className="rounded-xl border border-zinc-800 bg-zinc-900">
        <div className="border-b border-zinc-800 px-4 py-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              Inspector
            </h2>

            <div className="flex items-center gap-2">
              <span className="rounded border border-sky-500/20 bg-sky-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-300">
                PEPPOL
              </span>

              <span className="rounded border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-300">
                INVOICE
              </span>
            </div>
          </div>
        </div>

        <div className="divide-y divide-zinc-800">
          <FieldCard
            label="Invoice"
            value={analysis.invoiceNumber}
            segment="Invoice"
          />

          <FieldCard
            label="UBL version"
            value={analysis.ublVersion}
            segment="UBL"
          />

          <FieldCard
            label="Profile"
            value={analysis.profileId}
            segment="ProfileID"
          />
        </div>
      </div>

      {/* DOCUMENT */}

      <InspectorSection
        title="Document"
        fields={[
          {
            label: "Invoice number",
            value: analysis.invoiceNumber,
            segment: "ID",
          },
          {
            label: "Invoice type",
            value: analysis.invoiceTypeCode,
            segment: "InvoiceTypeCode",
          },
          {
            label: "Issue date",
            value: analysis.issueDate,
            segment: "IssueDate",
          },
          {
            label: "Due date",
            value: analysis.dueDate,
            segment: "DueDate",
          },
          {
            label: "Currency",
            value: analysis.currency,
            segment: "DocumentCurrencyCode",
          },
          {
            label: "Buyer reference",
            value: analysis.buyerReference,
            segment: "BuyerReference",
          },
          {
            label: "Purchase order",
            value: analysis.orderReference,
            segment: "OrderReference",
          },
        ]}
      />

      {/* SUPPLIER */}

      <InspectorSection
        title="Supplier"
        fields={[
          {
            label: "Name",
            value: analysis.supplier.name,
            segment: "Supplier",
          },
          {
            label: "VAT ID",
            value: analysis.supplier.vatId,
            segment: "CompanyID",
          },
          {
            label: "Peppol ID",
            value: endpoint(
              analysis.supplier.endpointScheme,
              analysis.supplier.endpointId,
            ),
            searchValue: analysis.supplier.endpointId,
            segment: "EndpointID",
          },
          {
            label: "Street",
            value: analysis.supplier.street,
            segment: "StreetName",
          },
          {
            label: "City",
            value: analysis.supplier.city,
            segment: "CityName",
          },
          {
            label: "Postal code",
            value: analysis.supplier.postalCode,
            segment: "PostalZone",
          },
          {
            label: "Country",
            value: analysis.supplier.country,
            segment: "Country",
          },
        ]}
      />

      {/* CUSTOMER */}

      <InspectorSection
        title="Customer"
        fields={[
          {
            label: "Name",
            value: analysis.customer.name,
            segment: "Customer",
          },
          {
            label: "VAT ID",
            value: analysis.customer.vatId,
            segment: "CompanyID",
          },
          {
            label: "Peppol ID",
            value: endpoint(
              analysis.customer.endpointScheme,
              analysis.customer.endpointId,
            ),
            searchValue: analysis.customer.endpointId,
            segment: "EndpointID",
          },
          {
            label: "Street",
            value: analysis.customer.street,
            segment: "StreetName",
          },
          {
            label: "City",
            value: analysis.customer.city,
            segment: "CityName",
          },
          {
            label: "Postal code",
            value: analysis.customer.postalCode,
            segment: "PostalZone",
          },
          {
            label: "Country",
            value: analysis.customer.country,
            segment: "Country",
          },
        ]}
      />

      {/* TOTALS */}

      <InspectorSection
        title="Totals"
        fields={[
          {
            label: "Net amount",
            value: analysis.netAmount
              ? `${analysis.netAmount} ${currency}`
              : undefined,
            searchValue: analysis.netAmount,
            segment: "LineExtensionAmount",
          },
          {
            label: "Tax exclusive",
            value: analysis.taxExclusiveAmount
              ? `${analysis.taxExclusiveAmount} ${currency}`
              : undefined,
            searchValue: analysis.taxExclusiveAmount,
            segment: "TaxExclusiveAmount",
          },
          {
            label: "VAT",
            value: analysis.taxAmount
              ? `${analysis.taxAmount} ${currency}`
              : undefined,
            searchValue: analysis.taxAmount,
            segment: "TaxAmount",
          },
          {
            label: "Total incl. VAT",
            value: analysis.taxInclusiveAmount
              ? `${analysis.taxInclusiveAmount} ${currency}`
              : undefined,
            searchValue: analysis.taxInclusiveAmount,
            segment: "TaxInclusiveAmount",
          },
          {
            label: "Amount due",
            value: analysis.payableAmount
              ? `${analysis.payableAmount} ${currency}`
              : undefined,
            searchValue: analysis.payableAmount,
            segment: "PayableAmount",
          },
        ]}
      />

      {/* VAT BREAKDOWN */}

      {analysis.vatBreakdown.map((vat, index) => (
        <InspectorSection
          key={`vat-${index}`}
          title={
            analysis.vatBreakdown.length === 1
              ? "VAT Breakdown"
              : `VAT Breakdown ${index + 1}`
          }
          fields={[
            {
              label: "Category",
              value: vat.category,
              segment: "TaxCategory",
            },
            {
              label: "Rate",
              value: vat.rate
                ? `${vat.rate}%`
                : undefined,
              searchValue: vat.rate,
              segment: "Percent",
            },
            {
              label: "Taxable amount",
              value: vat.taxableAmount
                ? `${vat.taxableAmount} ${currency}`
                : undefined,
              searchValue: vat.taxableAmount,
              segment: "TaxableAmount",
            },
            {
              label: "VAT amount",
              value: vat.taxAmount
                ? `${vat.taxAmount} ${currency}`
                : undefined,
              searchValue: vat.taxAmount,
              segment: "TaxAmount",
            },
          ]}
        />
      ))}

      {/* PAYMENT */}

      <InspectorSection
        title="Payment"
        fields={[
          {
            label: "Payment means",
            value: analysis.paymentMeansCode,
            segment: "PaymentMeansCode",
          },
          {
            label: "IBAN",
            value: analysis.iban,
            segment: "FinancialAccount",
          },
          {
            label: "Reference",
            value: analysis.paymentReference,
            segment: "PaymentID",
          },
        ]}
      />

      {/* LINES */}

      {analysis.lines.map((line, index) => (
        <InspectorSection
          key={line.id ?? `line-${index}`}
          title={`Line ${line.id ?? index + 1}`}
          fields={[
            {
              label: "Line number",
              value: line.id,
              segment: "InvoiceLine",
            },
            {
              label: "Description",
              value: line.name,
              segment: "Item",
            },
            {
              label: "Seller item ID",
              value: line.sellerItemId,
              segment: "SellersItemID",
            },
            {
              label: "Quantity",
              value: line.quantity
                ? `${line.quantity}${
                    line.unitCode
                      ? ` ${line.unitCode}`
                      : ""
                  }`
                : undefined,
              searchValue: line.quantity,
              segment: "InvoicedQuantity",
            },
            {
              label: "Unit price",
              value: line.price
                ? `${line.price} ${currency}`
                : undefined,
              searchValue: line.price,
              segment: "PriceAmount",
            },
            {
              label: "Net amount",
              value: line.netAmount
                ? `${line.netAmount} ${currency}`
                : undefined,
              searchValue: line.netAmount,
              segment: "LineExtensionAmount",
            },
            {
              label: "VAT",
              value: line.vatRate
                ? `${line.vatRate}%`
                : undefined,
              searchValue: line.vatRate,
              segment: "Percent",
            },
          ]}
        />
      ))}
    </div>
  );
}