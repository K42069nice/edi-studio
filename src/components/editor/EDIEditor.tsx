"use client";

import { useRef, useState } from "react";
import Editor from "@monaco-editor/react";

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

  return (
    <div
      className={`
        relative
        h-[500px]
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
        options={{
          minimap: {
            enabled: false,
          },
          fontSize: 14,
          fontFamily: "JetBrains Mono",
          wordWrap: "on",
          automaticLayout: true,
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: "smooth",
          renderLineHighlight: "all",
          padding: {
            top: 16,
            bottom: 16,
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