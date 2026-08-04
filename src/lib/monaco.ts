import type * as Monaco from "monaco-editor";

let initialized = false;

export function setupMonaco(monaco: typeof Monaco) {
  if (initialized) return;

  initialized = true;

  monaco.languages.register({
    id: "edi",
  });

  monaco.languages.setMonarchTokensProvider("edi", {
    tokenizer: {
      root: [
        [/^[A-Z]{2,3}(?=\+)/, "segment"],
        [/\+/, "delimiter"],
        [/:/, "component"],
        [/'/, "terminator"],
        [/\b\d+\b/, "number"],
        [/[A-Z0-9._-]+/, "value"],
      ],
    },
  });

  monaco.editor.defineTheme("edi-dark", {
    base: "vs-dark",
    inherit: true,

    rules: [
      {
        token: "segment",
        foreground: "60A5FA",
        fontStyle: "bold",
      },

      {
        token: "delimiter",
        foreground: "64748B",
      },

      {
        token: "component",
        foreground: "F59E0B",
      },

      {
        token: "terminator",
        foreground: "F43F5E",
      },

      {
        token: "number",
        foreground: "22C55E",
      },

      {
        token: "value",
        foreground: "E2E8F0",
      },
    ],

    colors: {
      "editor.background": "#0B1220",

      "editorLineNumber.foreground": "#475569",

      "editorCursor.foreground": "#60A5FA",

      "editor.lineHighlightBackground": "#111827",

      "editor.selectionBackground": "#1D4ED8AA",

      "editor.inactiveSelectionBackground": "#33415566",
    },
  });
}