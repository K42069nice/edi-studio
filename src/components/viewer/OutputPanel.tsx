"use client";

import { EDIAnalysis } from "@/types/edi";
import { PeppolInvoiceAnalysis } from "@/types/peppol";

import DESADVInspector from "./inspectors/desadv/DESADVInspector";
import ORDERSInspector from "./inspectors/orders/ORDERSInspector";
import PeppolInvoiceInspector from "./inspectors/peppol/PeppolInvoiceInspector";

import InspectorSection from "./inspectors/shared/InspectorSection";
import SummaryCard from "./inspectors/shared/SummaryCard";

type Props = {
  analysis: EDIAnalysis;
  peppolAnalysis?: PeppolInvoiceAnalysis | null;
};

export default function OutputPanel({ analysis, peppolAnalysis }: Props) {
  /*
   * XML / PEPPOL
   *
   * If a Peppol invoice has been detected, use the dedicated
   * Peppol inspector instead of the EDIFACT inspector.
   */
  if (peppolAnalysis) {
    return <PeppolInvoiceInspector analysis={peppolAnalysis} />;
  }

  /*
   * EMPTY STATE
   */
  if (!analysis.messageType) {
    return (
      <div className="h-full rounded-xl border border-zinc-800 bg-zinc-900">
        <div className="border-b border-zinc-800 px-4 py-2">
          <h2 className="text-lg font-semibold text-white">Inspector</h2>
        </div>

        <div className="flex h-[500px] items-center justify-center px-8 text-center">
          <div>
            <div className="mb-4 text-6xl">📄</div>

            <h3 className="text-lg font-medium text-white">
              No document loaded
            </h3>

            <p className="mt-2 text-sm text-zinc-500">
              Open, paste or drag an EDIFACT or XML file into the editor.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /*
   * EDIFACT
   */
  switch (analysis.messageType) {
    case "DESADV":
      return <DESADVInspector analysis={analysis} />;

    case "ORDERS":
      return <ORDERSInspector analysis={analysis} />;

    default:
      return (
        <div className="space-y-4">
          <SummaryCard
            messageType={analysis.messageType}
            version={analysis.version}
            segments={analysis.segments}
            status={analysis.status}
          />

          {analysis.sections.map((section) => (
            <InspectorSection
              key={section.id}
              title={section.title}
              fields={section.fields}
            />
          ))}
        </div>
      );
  }
}
