"use client";

import { LoadedFile } from "@/types/file";
import { CompareRow } from "../compare/compareEngine";

import EDIEditor from "../editor/EDIEditor";
import FileCard from "../upload/FileCard";

type Props = {
  title: string;
  edi: string;
  loadedFile: LoadedFile | null;
  setEdi: (value: string) => void;
  onFileSelected: (file: File) => void;

  diff: CompareRow[];

  side: "left" | "right";
  syncScroll: boolean;
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
}: Props) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="mb-4 text-xl font-semibold text-white">{title}</h2>

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
