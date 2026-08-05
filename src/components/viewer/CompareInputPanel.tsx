"use client";

import { Document } from "@/types/document";
import { CompareRow } from "../compare/compareEngine";

import EDIEditor from "../editor/EDIEditor";
import FileCard from "../upload/FileCard";

type Props = {
  title: string;
  edi: string;
  loadedFile: Document | null;
  setEdi: (value: string) => void;
  onFileSelected: (file: File) => void;

  diff: CompareRow[];

  side: "left" | "right";
  syncScroll: boolean;

  onClear: () => void;
};

export default function CompareInputPanel({
  title,
  edi,
  loadedFile,
  setEdi,
  onFileSelected,
  diff,
  side,
  syncScroll,
  onClear,
}: Props) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-4 flex h-7 items-center">
        <h2 className="text-xl font-semibold text-white">{title}</h2>

        <div className="ml-auto">
          {loadedFile && (
            <button
              onClick={onClear}
              className="flex h-6 w-6 items-center justify-center rounded text-white/60 transition hover:bg-slate-700 hover:text-white"
              title="Remove file"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <EDIEditor
        value={edi}
        onChange={setEdi}
        onFileSelected={onFileSelected}
        mode="compare"
        diff={diff}
        side={side}
        syncScroll={syncScroll}
      />

      {loadedFile && (
        <div className="mt-4">
          <FileCard file={loadedFile} />
        </div>
      )}
    </section>
  );
}
