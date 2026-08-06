"use client";

import { EDIAnalysis } from "@/types/edi";

import SummaryCard from "../shared/SummaryCard";
import InspectorSection from "../shared/InspectorSection";
import PackageCard from "../shared/PackageCard";

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

  const partyFields = analysis.partiesList.map((party) => ({
    label: party.label,
    value: party.id,
    segment: party.segment,
  }));

  const referenceFields = analysis.referencesList.map((reference) => ({
    label: reference.label,
    value: reference.value,
    segment: reference.segment,
  }));

  return (
    <div className="space-y-3">
      <SummaryCard
        messageType={analysis.messageType}
        version={analysis.version}
        segments={analysis.segments}
        status={analysis.status}
      />

      <div className="space-y-2">
        <InspectorSection title="📄 Header" fields={documentFields} />

        <InspectorSection title="👥 Parties" fields={partyFields} />

        <InspectorSection title="🔗 References" fields={referenceFields} />
      </div>
    </div>
  );
}
