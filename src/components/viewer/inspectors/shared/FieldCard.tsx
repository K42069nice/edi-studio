"use client";

import { useEditor } from "@/context/EditorContext";
import { useState } from "react";

type Props = {
  label: string;
  value?: string;
  segment?: string;

  // Optional value used only when searching inside Monaco.
  // If omitted, the displayed value is used as before.
  searchValue?: string;
};

export default function FieldCard({
  label,
  value,
  segment,
  searchValue,
}: Props) {
  const { scrollToValue } = useEditor();

  const [active, setActive] = useState(false);

  if (!value) {
    return null;
  }

  const targetValue = searchValue ?? value;

  return (
    <div
      className={`
        px-4
        py-2
        transition-all
        duration-200
        ${active ? "bg-sky-500/10" : "hover:bg-zinc-800/40"}
      `}
    >
      <div className="flex items-center justify-between">
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
              px-2.5
              py-1
              font-mono
              text-[10px]
              leading-none
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
          scrollToValue(targetValue);

          setActive(true);

          setTimeout(() => setActive(false), 250);
        }}
        className="
          mt-0.5
          block
          text-left
          font-mono
          text-[13px]
          font-medium
          leading-5
          text-zinc-100
          transition
          hover:text-sky-300
        "
      >
        {value}
      </button>
    </div>
  );
}
