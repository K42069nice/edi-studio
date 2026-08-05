"use client";

import { useEffect, useState } from "react";

import { EditorProvider } from "@/context/EditorContext";

import TopNavigation from "./TopNavigation";
import InputPanel from "./InputPanel";
import OutputPanel from "./OutputPanel";

import { LoadedFile } from "@/types/file";
import { EDIAnalysis } from "@/types/edi";

import { detectFileType } from "@/lib/file/detectFileType";
import { parseEDI } from "@/lib/ediParser";

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
  });

  useEffect(() => {
    if (!edi.trim()) {
      setAnalysis({
        messageType: "",
        version: null,
        sections: [],
        segments: 0,
        status: "",
      });

      return;
    }

    setAnalysis(parseEDI(edi));
  }, [edi]);

  async function handleFileSelected(file: File) {
    const content = await file.text();

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

      <div className="grid grid-cols-2 gap-6 p-8">
        <InputPanel
          edi={edi}
          setEdi={setEdi}
          onFileSelected={handleFileSelected}
          loadedFile={loadedFile}
        />

        <OutputPanel analysis={analysis}
        />
      </div>
    </main>
    </EditorProvider>
  );
}