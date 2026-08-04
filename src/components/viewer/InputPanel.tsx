"use client";

import { LoadedFile } from "@/types/file";

import EDIEditor from "../editor/EDIEditor";
import FileCard from "../upload/FileCard";

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
      <h2 className="mb-4 text-xl font-semibold text-white">
        Input
      </h2>

      <EDIEditor
        value={edi}
        onChange={setEdi}
        onFileSelected={onFileSelected}
      />

      {loadedFile && (
        <div className="mt-4">
          <FileCard file={loadedFile} />
        </div>
      )}
    </section>
  );
}