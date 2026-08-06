"use client";

import { EDIAnalysis } from "@/types/edi";
import { useEditor } from "@/context/EditorContext";
import { useState } from "react";

type Props = {
  analysis: EDIAnalysis;
};

export default function DESADVInspector({ analysis }: Props) {
  const { scrollToValue } = useEditor();

  const [activeValue, setActiveValue] = useState<string | null>(null);

  function Value({ label, value }: { label: string; value?: string | null }) {
    if (!value) return null;

    return (
      <div>
        <div className="mb-1 text-[11px] uppercase tracking-[0.18em] text-zinc-500">
          {label}
        </div>

        <button
          type="button"
          onClick={() => {
            const text = value.trim();

            setActiveValue(text);

            scrollToValue(text);

            setTimeout(() => {
              setActiveValue(null);
            }, 250);
          }}
          className={`
            text-left
            font-mono
            transition
            ${
              activeValue === value
                ? "text-sky-300"
                : "text-white hover:text-sky-300"
            }
          `}
        >
          {value}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900">
        <div className="border-b border-zinc-800 px-5 py-4">
          <h2 className="text-lg font-semibold text-white">Inspector</h2>
        </div>

        <div className="space-y-8 p-5">
          <section>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
              Document
            </h3>

            <div className="grid grid-cols-2 gap-5">
              <Value label="Message Type" value={analysis.messageType} />
              <Value label="Version" value={analysis.version} />

              <Value label="Document Number" value={analysis.document.number} />

              <Value
                label="Document Date"
                value={analysis.document.documentDate}
              />

              <Value
                label="Dispatch Date"
                value={analysis.document.dispatchDate}
              />

              <Value
                label="Delivery Date"
                value={analysis.document.deliveryDate}
              />
            </div>
          </section>

          <section>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
              Parties
            </h3>

            <div className="grid grid-cols-2 gap-5">
              <Value label="Buyer" value={analysis.parties.buyer} />

              <Value label="Supplier" value={analysis.parties.supplier} />

              <Value
                label="Delivery Point"
                value={analysis.parties.deliveryPoint}
              />

              <Value
                label="Invoice Recipient"
                value={analysis.parties.invoicee}
              />
            </div>
          </section>

          <section>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
              References
            </h3>

            <div className="grid grid-cols-2 gap-5">
              <Value label="Order Number" value={analysis.references.order} />

              <Value
                label="Delivery Note"
                value={analysis.references.deliveryNote}
              />
            </div>
          </section>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900">
        <div className="border-b border-zinc-800 px-5 py-4">
          <h2 className="text-lg font-semibold text-white">
            Line Items ({analysis.lines.length})
          </h2>
        </div>

        {analysis.lines.length === 0 ? (
          <div className="p-6 text-sm text-zinc-500">No line items found.</div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {analysis.lines.map((line) => (
              <div key={line.lineNumber} className="space-y-4 p-5">
                <div className="text-sm font-semibold text-sky-300">
                  Item #{line.lineNumber}
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <Value label="GTIN" value={line.gtin} />

                  <Value label="Buyer Article" value={line.buyerArticle} />

                  <Value
                    label="Supplier Article"
                    value={line.supplierArticle}
                  />

                  <Value label="Description" value={line.description} />

                  <Value
                    label="Quantity"
                    value={
                      line.quantity
                        ? `${line.quantity} ${line.quantityUnit ?? ""}`
                        : undefined
                    }
                  />

                  <Value label="Weight" value={line.weight} />

                  <Value label="Price" value={line.price} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
