"use client";

import { useEffect, useState } from "react";
import { formatEDI } from "@/lib/ediFormatter";

import { EditorProvider } from "@/context/EditorContext";

import TopNavigation from "./TopNavigation";
import InputPanel from "./InputPanel";
import OutputPanel from "./OutputPanel";

import { LoadedFile } from "@/types/file";
import { EDIAnalysis } from "@/types/edi";

import { detectFileType } from "@/lib/file/detectFileType";
import { parseEDI } from "@/lib/ediParser";

import PackagesWorkspace from "./workspace/PackagesWorkspace";

export default function Viewer() {
  const [edi, setEdi] = useState("");

  const [loadedFile, setLoadedFile] = useState<LoadedFile | null>(null);

  const [showSuccess, setShowSuccess] = useState(false);

  const [analysis, setAnalysis] = useState<EDIAnalysis>({
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
  });
  const hasWorkspace =
    analysis.packages.length > 0 || analysis.lines.length > 0;

  const [packagesExpanded, setPackagesExpanded] = useState(true);

  useEffect(() => {
    if (!edi.trim()) {
      setAnalysis({
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
      });

      return;
    }

    setAnalysis(parseEDI(edi));
  }, [edi]);

  async function handleFileSelected(file: File) {
    const content = formatEDI(await file.text());

    setEdi(content);

    setLoadedFile({
      name: file.name || "Untitled",
      size: file.size,
      type: detectFileType(content),
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
              setEdi={(value) => setEdi(formatEDI(value))}
              onFileSelected={handleFileSelected}
              loadedFile={loadedFile}
            />

            <OutputPanel analysis={analysis} />
          </div>

          {/* Bottom workspace (coming next) */}

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
                onToggle={() => setPackagesExpanded((v) => !v)}
              />
            </div>
          )}
        </div>
      </main>
    </EditorProvider>
  );
}
