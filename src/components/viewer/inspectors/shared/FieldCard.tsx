"use client";

import { useEditor } from "@/context/EditorContext";
import { useState } from "react";

type Props = {
  label: string;
  value?: string;
  segment?: string;
};

export default function FieldCard({ label, value, segment }: Props) {
  const { scrollToValue } = useEditor();

  const [active, setActive] = useState(false);

  if (!value) {
    return null;
  }

  return (
    <div
      className={`
        px-5
        py-4
        transition-all
        duration-200
        ${active ? "bg-sky-500/10" : "hover:bg-zinc-800/40"}
      `}
    >
      <div className="mb-3 flex items-center justify-between">
        <span
          className="
          text-[10px]
          font-semibold
          uppercase
          tracking-[0.18em]
          text-zinc-500
        "
        >
          {label}
        </span>

        {segment && (
          <span
            className="
            rounded
            border
            border-zinc-700
            bg-zinc-800
            px-2
            py-0.5
            font-mono
            text-[10px]
            text-zinc-300
          "
          >
            {segment}
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={() => {
          scrollToValue(value);

          setActive(true);

          setTimeout(() => setActive(false), 250);
        }}
        className="
        font-mono
        text-[13px]
        leading-6
        text-left
        text-zinc-100
        hover:text-sky-300
        transition
      "
      >
        {value}
      </button>
    </div>
  );
}
