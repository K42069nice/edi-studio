"use client";

import { LoadedFile } from "@/types/file";

import EDIEditor from "../editor/EDIEditor";

import { detectFileType } from "@/lib/file/detectFileType";

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
  const detectedType = detectFileType(edi);
  const contentType = loadedFile?.type ?? detectedType;
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-4 flex items-center gap-3">
        <h2 className="text-xl font-semibold text-white">Input</h2>

        {contentType === "EDIFACT" && (
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
        {contentType === "XML" && (
          <span
            className="
      rounded-md
      border
      border-sky-400/20
      bg-sky-400/[0.06]
      px-2.5
      py-0.5
      text-sm
      font-black
      tracking-tight
      text-sky-300
      select-none
    "
          >
            xml
          </span>
        )}
      </div>
      {
        <EDIEditor
          value={edi}
          onChange={setEdi}
          onFileSelected={onFileSelected}
        />
      }
    </section>
  );
}
