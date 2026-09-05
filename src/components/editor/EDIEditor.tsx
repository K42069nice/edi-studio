"use client";

import Editor from "@monaco-editor/react";
import { useEditor } from "@/context/EditorContext";
import { EDIFACT_SEGMENTS } from "@/lib/edifactSegments";
import { useEffect, useRef, useState } from "react";
import type { editor } from "monaco-editor";
import {
  updateSegmentDecorations,
  clearSegmentDecorations,
} from "@/lib/editorDecorations";
import EditorPlaceholder from "../upload/EditorPlaceholder";
import { CompareRow } from "@/components/compare/compareEngine";
import { applyCompareDecorations } from "@/components/compare/compareDecorations";
import { detectFileType } from "@/lib/file/detectFileType";
import { registerXmlTheme } from "@/lib/xml/xmlTheme";

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

  const monacoRef = useRef<typeof import("monaco-editor") | null>(null);

  const ignoreNextChange = useRef(false);
  const isInternalUpdate = useRef(false);
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
    }
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

  /*
   * Synchronise external value changes with the existing
   * Monaco model without recreating the editor.
   */
  useEffect(() => {
    const editor = editorRef.current;

    if (!editor) return;

    const model = editor.getModel();

    if (!model) return;

    if (model.getValue() === value) {
      return;
    }

    if (isInternalUpdate.current) {
      return;
    }

    ignoreNextChange.current = true;
    isInternalUpdate.current = true;

    const position = editor.getPosition();
    const scrollTop = editor.getScrollTop();
    const scrollLeft = editor.getScrollLeft();

    editor.pushUndoStop();

    model.pushEditOperations(
      [],
      [
        {
          range: model.getFullModelRange(),
          text: value,
        },
      ],
      () => null,
    );

    editor.pushUndoStop();

    if (position) {
      editor.setPosition(position);
    }

    editor.setScrollTop(scrollTop);
    editor.setScrollLeft(scrollLeft);

    requestAnimationFrame(() => {
      isInternalUpdate.current = false;
    });
  }, [value]);

  /*
   * Switch the existing Monaco model between EDIFACT/plaintext
   * and XML. The editor itself is NEVER recreated.
   */
  useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;

    if (!editor || !monaco) return;

    const model = editor.getModel();

    if (!model) return;

    const type = detectFileType(value);

    if (type !== "EDIFACT") {
      clearSegmentDecorations();
      highlightDecorations.current?.clear();
    }

    if (type === "XML") {
      if (model.getLanguageId() !== "xml") {
        monaco.editor.setModelLanguage(model, "xml");
      }

      monaco.editor.setTheme("edi-studio-xml");

      return;
    }

    if (model.getLanguageId() !== "plaintext") {
      monaco.editor.setModelLanguage(model, "plaintext");
    }

    monaco.editor.setTheme("vs-dark");

    if (type === "EDIFACT" && mode === "viewer") {
      updateSegmentDecorations(
        editor,
        monaco,
        pinnedSegments.current,
        disabledSegments.current,
      );
    }
  }, [value, mode]);

  useEffect(() => {
    registerScrollFunction(scrollToValue);
  }, [registerScrollFunction]);

  useEffect(() => {
    syncScrollRef.current = syncScroll;
  }, [syncScroll]);

  useEffect(() => {
    if (mode !== "compare") return;

    const editor = editorRef.current;
    const monaco = monacoRef.current;

    if (!editor || !monaco) return;

    applyCompareDecorations(editor, monaco, diff, side);
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
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onPaste={handlePaste}
    >
      <Editor
        height="500px"
        defaultLanguage="plaintext"
        theme="vs-dark"
        defaultValue=""
        onChange={(newValue) => {
          if (ignoreNextChange.current) {
            ignoreNextChange.current = false;
            return;
          }

          isInternalUpdate.current = false;

          const content = newValue ?? "";

          onChange(content);

          /*
           * EDIFACT decorations only.
           * XML is handled entirely by Monaco's XML language/theme.
           */
          if (mode === "viewer" && detectFileType(content) === "EDIFACT") {
            requestAnimationFrame(() => {
              const editor = editorRef.current;
              const monaco = monacoRef.current;

              if (!editor || !monaco) return;

              updateSegmentDecorations(
                editor,
                monaco,
                pinnedSegments.current,
                disabledSegments.current,
              );
            });
          }
        }}
        onMount={(editor, monaco) => {
          editorRef.current = editor;
          monacoRef.current = monaco;

          registerXmlTheme(monaco);

          if (mode === "compare") {
            (window as any)[side === "left" ? "leftEditor" : "rightEditor"] =
              editor;
          }

          highlightDecorations.current = editor.createDecorationsCollection();

          flashDecorations.current = editor.createDecorationsCollection();

          const initialType = detectFileType(value);

          if (initialType === "XML") {
            const model = editor.getModel();

            if (model) {
              monaco.editor.setModelLanguage(model, "xml");
            }

            monaco.editor.setTheme("edi-studio-xml");
          } else if (initialType === "EDIFACT" && mode === "viewer") {
            updateSegmentDecorations(
              editor,
              monaco,
              pinnedSegments.current,
              disabledSegments.current,
            );
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

          /*
           * EDIFACT segment selection highlighting.
           * Disabled completely for XML.
           */
          editor.onDidChangeCursorSelection(() => {
            const model = editor.getModel();

            if (!model || !highlightDecorations.current) return;

            if (model.getLanguageId() !== "plaintext") {
              highlightDecorations.current.clear();
              return;
            }

            const selection = editor.getSelection();

            if (!selection) return;

            const text = model.getValueInRange(selection).trim();

            if (!EDIFACT_SEGMENTS.has(text)) {
              highlightDecorations.current.clear();
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

          /*
           * EDIFACT segment pin/unpin interaction.
           * XML never enters this logic.
           */
          editor.onMouseDown((event) => {
            if (event.event.detail !== 2) return;

            const model = editor.getModel();

            if (!model) return;

            if (model.getLanguageId() !== "plaintext") {
              return;
            }

            const position = event.target.position;

            if (!position) return;

            // Only the first three characters of an EDIFACT segment.
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
