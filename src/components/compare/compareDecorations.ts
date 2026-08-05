import type { editor } from "monaco-editor";
import { getInlineDiff } from "./inlineDiff";
import { CompareRow } from "./compareEngine";

const collections = new WeakMap<
  editor.IStandaloneCodeEditor,
  editor.IEditorDecorationsCollection
>();

export function applyCompareDecorations(
  editorInstance: editor.IStandaloneCodeEditor,
  monaco: typeof import("monaco-editor"),
  rows: CompareRow[],
  side: "left" | "right"
) {
  const model = editorInstance.getModel();

  if (!model) return;

  let decorations = collections.get(editorInstance);

  if (!decorations) {
    decorations =
      editorInstance.createDecorationsCollection();

    collections.set(editorInstance, decorations);
  }

  const items: editor.IModelDeltaDecoration[] = [];

for (let index = 0; index < rows.length; index++) {
  const row = rows[index];

  // Номер строки в выровненном тексте Monaco
  const lineNumber = index + 1;

let className: string | undefined;


switch (row.type) {
  case "added":
    className =
      side === "right"
        ? "diff-added"
        : "diff-placeholder";
    break;

  case "removed":
    className =
      side === "left"
        ? "diff-added"
        : "diff-placeholder";
    break;

  case "changed":
    className = "diff-changed";
    break;

  default:
    continue;
}

console.log({
  lineNumber,
  side,
  type: row.type,
  left: row.left,
  right: row.right,
});

    items.push({
      range: new monaco.Range(
        lineNumber,
        1,
        lineNumber,
        model.getLineMaxColumn(lineNumber)
      ),

      options: {
        isWholeLine: true,
        className,
      },
    });

    if (row.type === "changed") {
  const diff = getInlineDiff(row.left, row.right);

  const inline =
    side === "left"
      ? diff.left
      : diff.right;

  if (inline.end > inline.start) {
    items.push({
      range: new monaco.Range(
        lineNumber,
        inline.start + 1,
        lineNumber,
        inline.end + 1
      ),

      options: {
        inlineClassName: "diff-inline-changed",
      },
    });
  }
}
  }

  decorations.set(items);
}