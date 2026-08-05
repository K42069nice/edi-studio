"use client";

import Editor, { OnMount } from "@monaco-editor/react";
import { useEditor } from "@/context/EditorContext";

import { EDIFACT_SEGMENTS } from "@/lib/edifactSegments";

import { useEffect, useRef, useState } from "react";
import type { editor } from "monaco-editor";

import { updateSegmentDecorations } from "@/lib/editorDecorations";
import EditorPlaceholder from "../upload/EditorPlaceholder";

import { CompareRow } from "@/components/compare/compareEngine";
import { applyCompareDecorations } from "@/components/compare/compareDecorations";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onFileSelected: (file: File) => void;

  mode?: "viewer" | "compare";

  diff?: CompareRow[];

  side?: "left" | "right";

  syncScroll?: boolean;
};
export default function EDIEditor({
  value,
  onChange,
  onFileSelected,
  mode = "viewer",
  diff = [],
  side = "left",
  syncScroll = false,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const isSyncing = useRef(false);
  const ignoreNextChange = useRef(false);
  const syncScrollRef = useRef(syncScroll);
  const highlightDecorations =
    useRef<editor.IEditorDecorationsCollection | null>(null);
  const flashDecorations = useRef<editor.IEditorDecorationsCollection | null>(
    null,
  );
  const pinnedSegments = useRef(new Map<string, string>());
  const disabledSegments = useRef(new Set<string>());

  const [isDragActive, setIsDragActive] = useState(false);
  const { registerScrollFunction } = useEditor();

  function handleDragEnter(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();

    if (!event.dataTransfer.types.includes("Files")) return;

    setIsDragActive(true);
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  function handleDragLeave(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();

    if (event.currentTarget.contains(event.relatedTarget as Node)) {
      return;
    }

    setIsDragActive(false);
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();

    setIsDragActive(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      onFileSelected(file);
      return;
    }

    const text = event.dataTransfer.getData("text/plain");

    if (text.trim()) {
      onChange(text);
    }
  }

  function handlePaste(event: React.ClipboardEvent<HTMLDivElement>) {
    const file = event.clipboardData.files?.[0];

    if (file) {
      event.preventDefault();
      onFileSelected(file);
      return;
    }

    // Для обычного текста ничего не делаем.
    // Monaco сам обработает вставку.
  }

  function handleBrowse() {
    fileInputRef.current?.click();
  }

  function scrollToValue(value: string) {
    const editor = editorRef.current;

    if (!editor) return;

    const model = editor.getModel();

    if (!model) return;

    const matches = model.findMatches(value, false, false, false, null, false);

    if (!matches.length) return;

    editor.revealRangeInCenter(matches[0].range);

    editor.setSelection(matches[0].range);

    editor.focus();
    if (flashDecorations.current) {
      flashDecorations.current.set([
        {
          range: matches[0].range,
          options: {
            inlineClassName: "editor-focus",
          },
        },
      ]);

      setTimeout(() => {
        flashDecorations.current?.clear();
      }, 700);
    }
  }

  useEffect(() => {
    const editor = editorRef.current;

    if (!editor) return;

    const model = editor.getModel();

    if (!model) return;

    // Уже актуально
    if (model.getValue() === value) {
      return;
    }

    ignoreNextChange.current = true;

    const position = editor.getPosition();
    const scrollTop = editor.getScrollTop();
    const scrollLeft = editor.getScrollLeft();

    model.setValue(value);

    if (position) {
      editor.setPosition(position);
    }

    editor.setScrollTop(scrollTop);
    editor.setScrollLeft(scrollLeft);
  }, [value]);

  useEffect(() => {
    registerScrollFunction(scrollToValue);
  }, [registerScrollFunction]);

  useEffect(() => {
    syncScrollRef.current = syncScroll;
    console.log("syncScroll =", syncScroll);
  }, [syncScroll]);

  useEffect(() => {
    if (mode !== "compare") return;

    if (!editorRef.current) return;

    const monaco = (
      window as typeof window & {
        monaco?: typeof import("monaco-editor");
      }
    ).monaco;

    if (!monaco) return;
    console.log("COMPARE", diff.length, side);

    applyCompareDecorations(editorRef.current, monaco, diff, side);
  }, [diff, mode, side]);

  return (
    <div
      className={`
        relative
        h-125
        overflow-hidden
        rounded-md
        transition-all
        ${isDragActive ? "ring-2 ring-zinc-300" : "ring-1 ring-zinc-800"}
      `}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onPaste={handlePaste}
    >
      <Editor
        height="500px"
        defaultLanguage="plaintext"
        theme="vs-dark"
        defaultValue=""
        onChange={(value) => {
          if (ignoreNextChange.current) {
            ignoreNextChange.current = false;
            return;
          }

          onChange(value ?? "");
        }}
        onMount={(editor, monaco) => {
          const model = monaco.editor.createModel("", "plaintext");

          editor.setModel(model);
          editorRef.current = editor;
          if (mode === "compare") {
            (window as any)[side === "left" ? "leftEditor" : "rightEditor"] =
              editor;
          }
          highlightDecorations.current = editor.createDecorationsCollection();
          flashDecorations.current = editor.createDecorationsCollection();
          if (mode === "viewer") {
            updateSegmentDecorations(editor, monaco, pinnedSegments.current);
          }

          editor.onDidScrollChange((event) => {
            if (!syncScrollRef.current) return;

            if ((window as any).__syncing) return;

            const other = (window as any)[
              side === "left" ? "rightEditor" : "leftEditor"
            ];

            if (!other) return;

            (window as any).__syncing = true;

            other.setScrollTop(event.scrollTop);
            other.setScrollLeft(event.scrollLeft);

            requestAnimationFrame(() => {
              (window as any).__syncing = false;
            });
          });

          editor.onDidChangeCursorSelection(() => {
            const model = editor.getModel();

            if (!model || !highlightDecorations.current) return;

            const selection = editor.getSelection();

            if (!selection) return;

            const text = model.getValueInRange(selection).trim();

            if (!EDIFACT_SEGMENTS.has(text)) {
              highlightDecorations.current.set([]);
              return;
            }

            const matches = model.findMatches(
              `\\b${text}\\b`,
              false,
              true,
              false,
              null,
              false,
            );

            highlightDecorations.current.set(
              matches.map((match) => ({
                range: match.range,
                options: {
                  inlineClassName: "segment-selected",
                },
              })),
            );
          });

          editor.onMouseDown((event) => {
            if (event.event.detail !== 2) return;

            const model = editor.getModel();

            if (!model) return;

            const position = event.target.position;

            if (!position) return;

            // Только первые три буквы сегмента
            if (position.column > 4) return;

            const line = model.getLineContent(position.lineNumber);

            const match = line.match(/^([A-Z]{3})/);

            if (!match) return;

            const tag = match[1];

            const hasDefaultColor = [
              "UNB",
              "UNH",
              "BGM",
              "DTM",
              "NAD",
              "LIN",
              "QTY",
              "PRI",
              "UNS",
              "UNT",
            ].includes(tag);

            const pinned = new Map(pinnedSegments.current);
            const disabled = new Set(disabledSegments.current);

            if (hasDefaultColor) {
              if (disabled.has(tag)) {
                disabled.delete(tag);
              } else {
                disabled.add(tag);
              }
            } else {
              if (pinned.has(tag)) {
                pinned.delete(tag);
              } else {
                pinned.set(tag, tag);
              }
            }

            pinnedSegments.current = pinned;
            disabledSegments.current = disabled;

            if (mode === "viewer") {
              updateSegmentDecorations(
                editor,
                monaco,
                pinnedSegments.current,
                disabledSegments.current,
              );
            }
          });
        }}
        options={{
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

      {value.trim() === "" && (
        <EditorPlaceholder
          onBrowse={handleBrowse}
          isDragActive={isDragActive}
        />
      )}

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];

          if (!file) return;

          onFileSelected(file);

          event.target.value = "";
        }}
      />
    </div>
  );
}
