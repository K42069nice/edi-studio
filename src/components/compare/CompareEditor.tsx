"use client";

import Editor from "@monaco-editor/react";

type Props = {
  title: string;
  value: string;
  onChange: (value: string) => void;
};

export default function CompareEditor({ title, value, onChange }: Props) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
      <div className="border-b border-zinc-800 px-5 py-3">
        <h2 className="font-semibold text-white">{title}</h2>
      </div>

      <Editor
        height="700px"
        defaultLanguage="plaintext"
        theme="vs-dark"
        value={value}
        onChange={(v) => onChange(v ?? "")}
        options={{
          minimap: { enabled: false },
          fontSize: 15,
          fontFamily: "JetBrains Mono",
          lineHeight: 26,
          automaticLayout: true,
          wordWrap: "off",
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
}
