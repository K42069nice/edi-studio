import type * as Monaco from "monaco-editor";

export function registerXmlTheme(monaco: typeof Monaco) {
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
        foreground: "94A3B8",
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
}
