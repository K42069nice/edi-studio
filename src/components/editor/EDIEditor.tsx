"use client";

import Editor, { OnMount } from "@monaco-editor/react";

import { EDIFACT_SEGMENTS } from "@/lib/edifactSegments";

import { useEffect, useRef, useState } from "react";
import type { editor } from "monaco-editor";

import { updateSegmentDecorations } from "@/lib/editorDecorations";
import EditorPlaceholder from "../upload/EditorPlaceholder";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onFileSelected: (file: File) => void;
};

export default function EDIEditor({
  value,
  onChange,
  onFileSelected,

}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const highlightDecorations = useRef<editor.IEditorDecorationsCollection | null>(null);

  const pinnedSegments = useRef(new Map<string, string>());
  const disabledSegments = useRef(new Set<string>());

  const [isDragActive, setIsDragActive] = useState(false);

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

    if (!file) return;

    onFileSelected(file);
  }

  function handlePaste(event: React.ClipboardEvent<HTMLDivElement>) {
    const file = event.clipboardData.files?.[0];

    if (!file) return;

    event.preventDefault();

    onFileSelected(file);
  }

  function handleBrowse() {
    fileInputRef.current?.click();
  }

  useEffect(() => {
    if (!editorRef.current) return;

    const monaco =
      (window as typeof window & {
        monaco?: typeof import("monaco-editor");
      }).monaco;

    if (!monaco) return;

    updateSegmentDecorations(
      editorRef.current,
      monaco,
      pinnedSegments.current,
      disabledSegments.current
    );
  }, [value]);

  return (
    <div
      className={`
        relative
        h-125
        overflow-hidden
        rounded-md
        transition-all
        ${
          isDragActive
            ? "ring-2 ring-zinc-300"
            : "ring-1 ring-zinc-800"
        }
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
        value={value}
        onChange={(value) => onChange(value ?? "")}
        onMount={(editor, monaco) => {
        editorRef.current = editor;
        highlightDecorations.current =
        editor.createDecorationsCollection();
        
        updateSegmentDecorations(
          editor,
          monaco,
          pinnedSegments.current
        );

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
            false
          );

          highlightDecorations.current.set(
            matches.map((match) => ({
              range: match.range,
              options: {
                inlineClassName: "segment-selected",
              },
            }))
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

          updateSegmentDecorations(
            editor,
            monaco,
            pinnedSegments.current,
            disabledSegments.current
          );
        
          
        });

      }} options={{
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