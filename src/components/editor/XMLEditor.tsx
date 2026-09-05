"use client";

import Editor from "@monaco-editor/react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function XMLEditor({ value, onChange }: Props) {
  return (
    <div className="relative h-125 overflow-hidden rounded-md ring-1 ring-zinc-800">
      <Editor
        height="500px"
        language="xml"
        value={value}
        onChange={(value) => onChange(value ?? "")}
        beforeMount={(monaco) => {
          monaco.editor.defineTheme("edi-studio-xml", {
            base: "vs-dark",
            inherit: true,

            rules: [
              {
                token: "tag",
                foreground: "7DD3FC",
              },
              {
                token: "delimiter",
                foreground: "64748B",
              },
              {
                token: "attribute.name",
                foreground: "C4B5FD",
              },
              {
                token: "attribute.value",
                foreground: "FDBA74",
              },
              {
                token: "string",
                foreground: "FDBA74",
              },
              {
                token: "comment",
                foreground: "64748B",
                fontStyle: "italic",
              },
            ],

            colors: {
              "editor.background": "#020617",
              "editorLineNumber.foreground": "#475569",
              "editorLineNumber.activeForeground": "#CBD5E1",
              "editorIndentGuide.background1": "#1E293B",
              "editorIndentGuide.activeBackground1": "#475569",
            },
          });
        }}
        theme="edi-studio-xml"
        options={{
          glyphMargin: true,
          lineNumbersMinChars: 1,
          lineDecorationsWidth: 1,

          minimap: {
            enabled: false,
          },

          fontSize: 15,
          fontFamily: "JetBrains Mono",
          fontLigatures: true,
          lineHeight: 26,

          wordWrap: "on",
          automaticLayout: true,
          scrollBeyondLastLine: false,
          smoothScrolling: true,

          cursorBlinking: "phase",
          cursorSmoothCaretAnimation: "on",

          renderLineHighlight: "all",
          roundedSelection: true,

          guides: {
            indentation: true,
          },

          padding: {
            top: 20,
            bottom: 20,
          },
        }}
      />
    </div>
  );
}
