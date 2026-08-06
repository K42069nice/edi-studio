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
  side: "left" | "right",
) {
  const model = editorInstance.getModel();

  if (!model) return;

  let decorations = collections.get(editorInstance);

  if (!decorations) {
    decorations = editorInstance.createDecorationsCollection();

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
        className = side === "right" ? "diff-added" : "diff-placeholder";
        break;

      case "removed":
        className = side === "left" ? "diff-removed" : "diff-placeholder";
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

    if (lineNumber > model.getLineCount()) {
      continue;
    }

    const maxColumn = model.getLineMaxColumn(lineNumber);

    items.push({
      range: new monaco.Range(lineNumber, 1, lineNumber, maxColumn),

      options: {
        isWholeLine: true,
        className,
        glyphMarginClassName:
          row.type === "added"
            ? side === "right"
              ? "glyph-plus"
              : undefined
            : row.type === "removed"
              ? side === "left"
                ? "glyph-minus"
                : undefined
              : undefined,
      },
    });

    if (row.type === "changed") {
      const diff = getInlineDiff(row.left, row.right);

      const inline = side === "left" ? diff.left : diff.right;

      if (inline.end > inline.start) {
        const startColumn = Math.min(inline.start + 1, maxColumn);
        const endColumn = Math.min(inline.end + 1, maxColumn);

        if (endColumn > startColumn) {
          items.push({
            range: new monaco.Range(
              lineNumber,
              startColumn,
              lineNumber,
              endColumn,
            ),

            options: {
              inlineClassName: "diff-inline-changed",
            },
          });
        }
      }
    }
  }

  decorations.set(items);
}
