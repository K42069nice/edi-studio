import type { editor } from "monaco-editor";

let decorations: editor.IEditorDecorationsCollection | null = null;

const COLORS: Record<string, string> = {
  UNB: "segment-blue",
  UNH: "segment-blue",
  BGM: "segment-green",
  DTM: "segment-orange",
  NAD: "segment-purple",
  LIN: "segment-red",
  QTY: "segment-cyan",
  PRI: "segment-yellow",
  UNS: "segment-gray",
  UNT: "segment-pink",
};

const PIN_COLORS: Record<string, string> = {
  UNB: "pin-blue",
  UNH: "pin-blue",
  BGM: "pin-green",
  DTM: "pin-orange",
  NAD: "pin-purple",
  LIN: "pin-red",
  QTY: "pin-cyan",
  PRI: "pin-yellow",
  RFF: "pin-green",
  IMD: "pin-pink",
  MEA: "pin-orange",
  LOC: "pin-blue",
  PAC: "pin-green",
  PCI: "pin-purple",
  GIN: "pin-red",
  CPS: "pin-cyan",
  UNS: "pin-yellow",
  UNT: "pin-pink",
};

export function updateSegmentDecorations(
  editorInstance: editor.IStandaloneCodeEditor,
  monaco: typeof import("monaco-editor"),
  pinnedSegments: Map<string, string> = new Map(),
  disabledSegments: Set<string> = new Set()
)
{
  const model = editorInstance.getModel();

  if (!model) return;

  if (!decorations) {
    decorations = editorInstance.createDecorationsCollection();
  }

  const items: editor.IModelDeltaDecoration[] = [];

  for (let line = 1; line <= model.getLineCount(); line++) {
    const text = model.getLineContent(line);

    const match = text.match(/^([A-Z]{3})/);

    if (!match) continue;

    const tag = match[1];

    let css: string | undefined;

      if (disabledSegments.has(tag)) {
        css = undefined;
      } else if (pinnedSegments.has(tag)) {
        css = PIN_COLORS[tag] ?? "pin-green";
      } else {
        css = COLORS[tag];
      }

    if (!css) continue;

    items.push({
      range: new monaco.Range(line, 1, line, 4),
      options: {
        inlineClassName: css,
      },
    });
  }

  decorations.set(items);
}