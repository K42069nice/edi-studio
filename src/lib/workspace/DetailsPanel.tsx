"use client";

import { TreeNode } from "@/types/tree";
import { LineItem, Package } from "@/lib/parser/types";

type Props = {
  node: TreeNode | null;
};

export default function DetailsPanel({ node }: Props) {
  if (!node) {
    return (
      <div className="flex h-full items-center justify-center text-zinc-500">
        Select an item
      </div>
    );
  }

  return node.type === "package" ? (
    <PackageDetails pkg={node.data as Package} />
  ) : (
    <LineDetails line={node.data as LineItem} />
  );
}

function PackageDetails({ pkg }: { pkg: Package }) {
  return (
    <div className="grid grid-cols-2 gap-5">
      <Detail title="SSCC" value={pkg.sscc} segment="GIN+BJ" />
      <Detail title="Package Type" value={pkg.packageType} segment="PAC" />
      <Detail title="Weight" value={pkg.weight} segment="MEA" />
    </div>
  );
}

function LineDetails({ line }: { line: LineItem }) {
  return (
    <div className="grid grid-cols-2 gap-5">
      <Detail title="GTIN" value={line.gtin} segment="LIN" />

      <Detail
        title="Buyer Article"
        value={line.buyerArticle}
        segment="PIA+BP"
      />

      <Detail
        title="Supplier Article"
        value={line.supplierArticle}
        segment="PIA+SA"
      />

      <Detail title="Description" value={line.description} segment="IMD" />

      <Detail
        title="Quantity"
        value={
          line.quantity
            ? `${line.quantity}${line.quantityUnit ? ` ${line.quantityUnit}` : ""}`
            : undefined
        }
        segment="QTY"
      />

      <Detail title="Weight" value={line.weight} segment="MEA" />

      <Detail title="Price" value={line.price} segment="PRI" />
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
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
          {title}
        </span>

        {segment && (
          <span className="rounded border border-zinc-700 bg-zinc-800 px-2 py-0.5 font-mono text-[10px] text-zinc-300">
            {segment}
          </span>
        )}
      </div>

      <div className="px-3 py-3 font-mono text-sm text-white">{value}</div>
    </div>
  );
}
