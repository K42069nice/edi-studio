"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Package as PackageIcon,
  FileText,
} from "lucide-react";

import { Package } from "@/lib/parser/types";
import { EDILine } from "@/types/edi";

type Props = {
  pkg: Package;
  onSelectLine(line: EDILine): void;
};

export default function PackageCard({ pkg, onSelectLine }: Props) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="
          flex
          w-full
          items-center
          gap-2
          rounded-md
          px-2
          py-1.5
          transition
          hover:bg-zinc-800/40
        "
      >
        {expanded ? (
          <ChevronDown size={15} className="text-zinc-500" />
        ) : (
          <ChevronRight size={15} className="text-zinc-500" />
        )}

        <PackageIcon size={16} className="shrink-0 text-amber-400" />

        <div className="flex-1 text-left">
          <div className="font-mono text-sm text-white">
            {pkg.sscc ?? "Package"}
          </div>

          <div className="text-[11px] text-zinc-500">
            {pkg.packageType ?? "Package"}
          </div>
        </div>

        <span className="rounded border border-zinc-700 bg-zinc-800 px-2 py-0.5 font-mono text-[10px] text-zinc-300">
          GIN+BJ
        </span>
      </button>

      {expanded && (
        <div className="ml-6 border-l border-zinc-800 pl-3">
          {pkg.lines.map((line) => (
            <button
              key={line.lineNumber}
              type="button"
              onClick={() => onSelectLine(line)}
              className="
                mt-1
                flex
                w-full
                items-center
                gap-2
                rounded-md
                px-2
                py-1.5
                text-left
                transition
                hover:bg-sky-500/10
              "
            >
              <FileText size={14} className="text-sky-400" />

              <span className="text-sm text-white">Line {line.lineNumber}</span>

              {line.gtin && (
                <span className="ml-auto font-mono text-[11px] text-zinc-500">
                  {line.gtin}
                </span>
              )}
            </button>
          ))}

          {pkg.children.map((child) => (
            <PackageCard
              key={child.id}
              pkg={child}
              onSelectLine={onSelectLine}
            />
          ))}
        </div>
      )}
    </div>
  );
}
