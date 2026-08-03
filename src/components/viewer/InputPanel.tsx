"use client";

import EDIEditor from "../editor/EDIEditor";
type Props = {
  edi: string;
  setEdi: (value: string) => void;
  onAnalyze: () => void;
};

export default function InputPanel({ edi, setEdi, onAnalyze }: Props) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Input</h2>

      <EDIEditor value={edi} onChange={setEdi} />

      <div className="mt-5 rounded-lg border-2 border-dashed border-slate-700 p-8 text-center text-slate-400 hover:border-blue-500 transition">
        <p className="text-lg">📂 Drag & Drop EDI file here</p>

        <p className="mt-2 text-sm">or click to browse</p>
      </div>

      <div className="mt-4">
        <button
          onClick={onAnalyze}
          className="
    bg-blue-600
    hover:bg-blue-700
    px-6
    py-3
    rounded-lg
    text-white
  "
        >
          Analyze
        </button>
      </div>
    </section>
  );
}
