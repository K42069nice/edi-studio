"use client";

import { LoadedFile } from "@/types/file";

import EDIEditor from "../editor/EDIEditor";

type Props = {
  edi: string;
  loadedFile: LoadedFile | null;
  setEdi: (value: string) => void;
  onFileSelected: (file: File) => void;
};

export default function InputPanel({
  edi,
  loadedFile,
  setEdi,
  onFileSelected,
}: Props) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-4 flex items-center gap-3">
        <h2 className="text-xl font-semibold text-white">Input</h2>

        {loadedFile?.type === "EDIFACT" && (
          <span
            className="
              rounded-md
              border
            border-white/15
            bg-white/[0.03]
              px-2.5
              py-0.5
              text-sm
              font-black
              tracking-tight
            text-white/90
              select-none
              transition-colors
              hover:border-white/25
              hover:bg-white/[0.05]
              "
          >
            edifact
          </span>
        )}
      </div>

      <EDIEditor
        value={edi}
        onChange={setEdi}
        onFileSelected={onFileSelected}
      />
    </section>
  );
}
