"use client";

import { useEffect, useState } from "react";

import { EditorProvider } from "@/context/EditorContext";

import TopNavigation from "./TopNavigation";
import InputPanel from "./InputPanel";
import OutputPanel from "./OutputPanel";
import PackagesWorkspace from "./workspace/PackagesWorkspace";

import { LoadedFile } from "@/types/file";
import { EDIAnalysis } from "@/types/edi";
import { PeppolInvoiceAnalysis } from "@/types/peppol";

import { detectFileType } from "@/lib/file/detectFileType";

import { formatEDI } from "@/lib/ediFormatter";
import { parseEDI } from "@/lib/ediParser";

import { formatXml } from "@/lib/xml/formatXML";
import { parsePeppolInvoice } from "@/lib/peppol/parsePeppolInvoice";

const emptyAnalysis: EDIAnalysis = {
  messageType: "",
  version: null,

  sections: [],

  segments: 0,
  status: "",

  document: {},

  references: {},

  parties: {},

  lines: [],

  partiesList: [],

  referencesList: [],

  dates: [],

  packages: [],

  workspace: [],
};

export default function Viewer() {
  const [edi, setEdi] = useState("");

  const [loadedFile, setLoadedFile] = useState<LoadedFile | null>(null);

  const [showSuccess, setShowSuccess] = useState(false);

  const [analysis, setAnalysis] = useState<EDIAnalysis>(emptyAnalysis);

  const [peppolAnalysis, setPeppolAnalysis] =
    useState<PeppolInvoiceAnalysis | null>(null);

  const [packagesExpanded, setPackagesExpanded] = useState(true);

  const hasWorkspace =
    analysis.packages.length > 0 || analysis.lines.length > 0;

  /*
   * Analyse the document depending on its detected format.
   *
   * EDIFACT and XML/Peppol are deliberately kept separate.
   */
  useEffect(() => {
    if (!edi.trim()) {
      setAnalysis(emptyAnalysis);
      setPeppolAnalysis(null);

      return;
    }

    const type = detectFileType(edi);

    /*
     * XML / PEPPOL
     */
    if (type === "XML") {
      const peppol = parsePeppolInvoice(edi);

      setPeppolAnalysis(peppol);

      // Prevent old EDIFACT information from remaining visible.
      setAnalysis(emptyAnalysis);

      return;
    }

    /*
     * EDIFACT
     */
    if (type === "EDIFACT") {
      setPeppolAnalysis(null);
      setAnalysis(parseEDI(edi));

      return;
    }

    /*
     * Unknown format
     */
    setPeppolAnalysis(null);
    setAnalysis(emptyAnalysis);
  }, [edi]);

  /*
   * Format content according to document type.
   */
  function formatContent(content: string): string {
    const type = detectFileType(content);

    if (type === "EDIFACT") {
      return formatEDI(content);
    }

    if (type === "XML") {
      return formatXml(content);
    }

    return content;
  }

  /*
   * Handle files opened through browse / drag & drop.
   */
  async function handleFileSelected(file: File) {
    const rawContent = await file.text();

    const type = detectFileType(rawContent);
    const content = formatContent(rawContent);

    setEdi(content);

    setLoadedFile({
      name: file.name || "Untitled",
      size: file.size,
      type,
    });

    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  }

  return (
    <EditorProvider>
      <main className="min-h-screen bg-slate-950">
        {showSuccess && (
          <div className="fixed right-6 top-6 z-50 rounded-lg border border-green-500 bg-green-500/10 px-4 py-3 text-green-300 shadow-lg backdrop-blur">
            ✅ File loaded successfully
          </div>
        )}

        <TopNavigation loadedFile={loadedFile} />

        <div className="space-y-6 p-8">
          {/* Top workspace */}

          <div className="grid grid-cols-2 gap-6">
            <InputPanel
              edi={edi}
              setEdi={(value) => setEdi(formatContent(value))}
              onFileSelected={handleFileSelected}
              loadedFile={loadedFile}
            />

            <OutputPanel analysis={analysis} peppolAnalysis={peppolAnalysis} />
          </div>

          {/* EDIFACT workspace */}

          {hasWorkspace && (
            <div
              className={`
                overflow-hidden
                rounded-xl
                border
                border-zinc-800
                bg-zinc-900
                transition-all
                duration-300
                ${packagesExpanded ? "h-[68vh]" : "h-16"}
              `}
            >
              <PackagesWorkspace
                messageType={analysis.messageType}
                packages={analysis.packages}
                lines={analysis.lines}
                expanded={packagesExpanded}
                onToggle={() => setPackagesExpanded((value) => !value)}
              />
            </div>
          )}
        </div>
      </main>
    </EditorProvider>
  );
}
