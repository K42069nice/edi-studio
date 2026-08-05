"use client";

import { useMemo, useState } from "react";

import TopNavigation from "../viewer/TopNavigation";
import CompareInputPanel from "../viewer/CompareInputPanel";
import Switch from "../ui/Switch";

import { LoadedFile } from "@/types/file";
import { detectFileType } from "@/lib/file/detectFileType";

import { compareEngine } from "./compareEngine";
import { compareDiff } from "./compareDiff";

export default function CompareViewer() {
  const [leftEdi, setLeftEdi] = useState("");
  const [rightEdi, setRightEdi] = useState("");

  const [leftFile, setLeftFile] = useState<LoadedFile | null>(null);
  const [rightFile, setRightFile] = useState<LoadedFile | null>(null);

  const [syncScroll, setSyncScroll] = useState(true);

  async function handleLeftFile(file: File) {
    const content = await file.text();

    setLeftEdi(content);

    setLeftFile({
      name: file.name,
      size: file.size,
      type: detectFileType(content),
    });
  }

  async function handleRightFile(file: File) {
    const content = await file.text();

    setRightEdi(content);

    setRightFile({
      name: file.name,
      size: file.size,
      type: detectFileType(content),
    });
  }

  const engine = useMemo(() => {
    return compareEngine(leftEdi, rightEdi);
  }, [leftEdi, rightEdi]);

  const diff = useMemo(() => {
    return engine.rows;
  }, [engine.rows]);

  return (
    <main className="min-h-screen bg-slate-950">
      <TopNavigation loadedFile={null} />

      <div className="p-8">
        <div className="mb-6 flex justify-end">
          <Switch
            checked={syncScroll}
            onChange={setSyncScroll}
            label="Sync Scroll"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <CompareInputPanel
            title="File 1"
            edi={engine.leftText}
            loadedFile={leftFile}
            setEdi={setLeftEdi}
            onFileSelected={handleLeftFile}
            diff={diff}
            side="left"
            syncScroll={syncScroll}
          />

          <CompareInputPanel
            title="File 2"
            edi={engine.rightText}
            loadedFile={rightFile}
            setEdi={setRightEdi}
            onFileSelected={handleRightFile}
            diff={diff}
            side="right"
            syncScroll={syncScroll}
          />
        </div>
      </div>
    </main>
  );
}
