"use client";

import { useEffect, useMemo, useState } from "react";

import { Document } from "@/types/document";
import TopNavigation from "../viewer/TopNavigation";
import CompareInputPanel from "../viewer/CompareInputPanel";
import Switch from "../ui/Switch";
import { detectFileType } from "@/lib/file/detectFileType";

import { compareEngine } from "./compareEngine";

export default function CompareViewer() {
  const [leftDocument, setLeftDocument] = useState<Document | null>(null);
  const [rightDocument, setRightDocument] = useState<Document | null>(null);
  const [syncScroll, setSyncScroll] = useState(true);

  const [showIdentical, setShowIdentical] = useState(false);

  async function handleLeftFile(file: File) {
    const content = await file.text();

    setLeftDocument({
      content,
      name: file.name,
      size: file.size,
      type: detectFileType(content),
      isVirtual: false,
    });
  }

  async function handleRightFile(file: File) {
    const content = await file.text();

    setRightDocument({
      content,
      name: file.name,
      size: file.size,
      type: detectFileType(content),
      isVirtual: false,
    });
  }

  function clearLeft() {
    setLeftDocument(null);
  }

  function clearRight() {
    setRightDocument(null);
  }

  function handleLeftChange(value: string) {
    setLeftDocument((prev) => {
      if (value.trim() === "") {
        return null;
      }

      return {
        content: value,
        name: prev?.name ?? "Untitled",
        size: value.length,
        type: detectFileType(value),
        isVirtual: prev?.isVirtual ?? true,
      };
    });
  }

  function handleRightChange(value: string) {
    setRightDocument((prev) => {
      if (value.trim() === "") {
        return null;
      }

      return {
        content: value,
        name: prev?.name ?? "Untitled",
        size: value.length,
        type: detectFileType(value),
        isVirtual: prev?.isVirtual ?? true,
      };
    });
  }

  const engine = useMemo(() => {
    return compareEngine(
      leftDocument?.content ?? "",
      rightDocument?.content ?? "",
    );
  }, [leftDocument, rightDocument]);

  const diff = useMemo(() => {
    if (!leftDocument || !rightDocument) {
      return [];
    }

    return engine.rows;
  }, [engine.rows, leftDocument, rightDocument]);

  useEffect(() => {
    if (!leftDocument || !rightDocument) {
      setShowIdentical(false);
      return;
    }

    const identical =
      leftDocument?.content === rightDocument?.content &&
      leftDocument?.content.trim() !== "";

    setShowIdentical(identical);

    if (identical) {
      const timer = setTimeout(() => {
        setShowIdentical(false);
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [diff, leftDocument, rightDocument]);

  return (
    <main className="min-h-screen bg-slate-950">
      <TopNavigation loadedFile={null} />

      {showIdentical && (
        <div className="fixed left-1/2 top-20 z-50 -translate-x-1/2 rounded-lg border border-emerald-700 bg-emerald-900/90 px-5 py-3 shadow-xl backdrop-blur">
          <div className="flex items-center gap-2 text-emerald-100">
            <span className="text-lg">✅</span>

            <div>
              <div className="font-semibold">Files are identical</div>

              <div className="text-sm text-emerald-300">
                No differences were found.
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-8">
        {leftDocument && rightDocument && (
          <div className="mb-6 flex justify-end">
            <Switch
              checked={syncScroll}
              onChange={setSyncScroll}
              label="Sync Scroll"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
          <CompareInputPanel
            title="File 1"
            edi={leftDocument?.content ?? ""}
            loadedFile={leftDocument}
            setEdi={handleLeftChange}
            onFileSelected={handleLeftFile}
            onClear={clearLeft}
            diff={diff}
            side="left"
            syncScroll={syncScroll}
          />

          <CompareInputPanel
            title="File 2"
            edi={rightDocument?.content ?? ""}
            loadedFile={rightDocument}
            setEdi={handleRightChange}
            onFileSelected={handleRightFile}
            onClear={clearRight}
            diff={diff}
            side="right"
            syncScroll={syncScroll}
          />
        </div>
      </div>
    </main>
  );
}
