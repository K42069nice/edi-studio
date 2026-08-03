"use client";

import { useState } from "react";

import TopNavigation from "./TopNavigation";
import InputPanel from "./InputPanel";
import OutputPanel from "./OutputPanel";

import { parseEDI, type EDIAnalysis } from "@/lib/ediParser";

export default function Viewer() {
  const [edi, setEdi] = useState("");

  const [analysis, setAnalysis] = useState<EDIAnalysis>({
    messageType: "-",
    segments: 0,
    buyer: "-",
  });

  function handleAnalyze() {
    const result = parseEDI(edi);
    setAnalysis(result);
  }

  return (
    <main className="bg-slate-950 min-h-screen">
      <TopNavigation />

      <div className="grid grid-cols-2 gap-6 p-8">
        <InputPanel edi={edi} setEdi={setEdi} onAnalyze={handleAnalyze} />

        <OutputPanel analysis={analysis} />
      </div>
    </main>
  );
}
