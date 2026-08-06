"use client";

import { EDIAnalysis } from "@/types/edi";

import SummaryCard from "../shared/SummaryCard";
import InspectorSection from "../shared/InspectorSection";

type Props = {
  analysis: EDIAnalysis;
};

export default function ORDERSInspector({ analysis }: Props) {
  const documentFields = [
    {
      label: "Order Number",
      value: analysis.document.number,
      segment: "BGM",
    },
    {
      label: "Order Date",
      value: analysis.document.documentDate,
      segment: "DTM+137",
    },
  ];

  const partyFields = analysis.partiesList.map((party) => ({
    label: party.label,
    value: party.id,
    segment: party.segment,
  }));

  return (
    <div className="space-y-4">
      <SummaryCard
        messageType={analysis.messageType}
        version={analysis.version}
        segments={analysis.segments}
        status={analysis.status}
      />

      <InspectorSection title="📄 Header" fields={documentFields} />

      <InspectorSection title="👥 Parties" fields={partyFields} />
    </div>
  );
}
