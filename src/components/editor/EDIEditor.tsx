"use client";

import Editor from "@monaco-editor/react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function EDIEditor({ value, onChange }: Props) {
  return (
    <Editor
      height="500px"
      defaultLanguage="plaintext"
      theme="vs-dark"
      value={value}
      onChange={(value) => onChange(value ?? "")}
      options={{
        minimap: {
          enabled: false,
        },

        fontSize: 14,

        fontFamily: "JetBrains Mono",

        wordWrap: "on",

        automaticLayout: true,

        scrollBeyondLastLine: false,
      }}
    />
  );
}