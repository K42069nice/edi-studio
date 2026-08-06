"use client";

import { EDIAnalysis } from "@/types/edi";
import { useEditor } from "@/context/EditorContext";
import { useState } from "react";
import LineCard from "../inspectors/shared/LineCard";

type Props = {
  analysis: EDIAnalysis;
};

export default function DESADVInspector({ analysis }: Props) {
  const documentFields = [
    {
      label: "Despatch Advice",
      value: analysis.document.number,
      segment: "BGM",
    },
    {
      label: "Document Date",
      value: analysis.document.documentDate,
      segment: "DTM+137",
    },
    {
      label: "Dispatch Date",
      value: analysis.document.dispatchDate,
      segment: "DTM+11",
    },
    {
      label: "Delivery Date",
      value: analysis.document.deliveryDate,
      segment: "DTM+17",
    },
  ];

  const partyFields =
    analysis.partiesList?.map((party) => ({
      label: party.label,
      value: party.id,
      segment: party.segment,
    })) ?? [];

  const referenceFields =
    analysis.referencesList?.map((reference) => ({
      label: reference.label,
      value: reference.value,
      segment: reference.segment,
    })) ?? [];

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
          <div className="divide-y divide-zinc-800"></div>
        )}
      </div>
    </div>
  );
}
