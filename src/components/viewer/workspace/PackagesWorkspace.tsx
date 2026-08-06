"use client";

import { useState } from "react";

import type { Package } from "@/lib/parser/types";
import type { EDILine } from "@/types/edi";

import PackageCard from "../inspectors/shared/PackageCard";

import { Maximize2, Minimize2 } from "lucide-react";

type Props = {
  packages: Package[];
  expanded: boolean;
  onToggle(): void;
};

export default function PackagesWorkspace({
  packages,
  expanded,
  onToggle,
}: Props) {
  const [selectedLine, setSelectedLine] = useState<EDILine | null>(null);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-3">
        <div>
          <h2 className="text-lg font-semibold text-white">
            📦 Packages & Lines
          </h2>

          <p className="mt-1 text-xs text-zinc-500">CPS • PAC • GIN • LIN</p>
        </div>

        <button
          onClick={onToggle}
          className="
            flex
            items-center
            gap-2
            rounded-lg
            border
            border-zinc-700
            bg-zinc-800
            px-3
            py-2
            text-sm
            text-white
            transition
            hover:bg-zinc-700
          "
        >
          {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          {expanded ? "Collapse" : "Expand"}
        </button>
      </div>

      <div className="grid flex-1 grid-cols-[1fr_1fr] overflow-hidden">
        {/* Tree */}

        <div className="overflow-auto border-r border-zinc-800 p-3">
          <div className="space-y-1">
            {packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                onSelectLine={setSelectedLine}
              />
            ))}
          </div>
        </div>

        {/* Details */}

        <div className="overflow-auto p-6">
          {!selectedLine ? (
            <div className="flex h-full items-center justify-center text-zinc-500">
              Select a line to inspect
            </div>
          ) : (
            <>
              <div className="mb-8">
                <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Line
                </div>

                <div className="mt-2 font-mono text-2xl text-white">
                  {selectedLine.lineNumber}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-10 gap-y-6">
                <Detail title="GTIN" value={selectedLine.gtin} segment="LIN" />

                <Detail
                  title="Buyer Article"
                  value={selectedLine.buyerArticle}
                  segment="PIA+BP"
                />

                <Detail
                  title="Internal Article"
                  value={selectedLine.internalArticle}
                  segment="PIA+IN"
                />

                <Detail
                  title="Supplier Article"
                  value={selectedLine.supplierArticle}
                  segment="PIA+SA"
                />

                <Detail
                  title="Description"
                  value={selectedLine.description}
                  segment="IMD"
                />

                <Detail
                  title="Quantity"
                  value={
                    selectedLine.quantity
                      ? `${selectedLine.quantity} ${selectedLine.quantityUnit ?? ""}`
                      : undefined
                  }
                  segment="QTY"
                />

                <Detail
                  title="Weight"
                  value={selectedLine.weight}
                  segment="MEA"
                />

                <Detail
                  title="Price"
                  value={selectedLine.price}
                  segment="PRI"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Detail({
  title,
  value,
  segment,
}: {
  title: string;
  value?: string;
  segment?: string;
}) {
  if (!value) return null;

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/40">
      <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-2">
        <span
          className="
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.18em]
            text-zinc-500
          "
        >
          {title}
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

      <div className="px-3 py-3 font-mono text-sm text-white">{value}</div>
    </div>
  );
}
