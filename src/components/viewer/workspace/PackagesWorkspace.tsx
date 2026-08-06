"use client";

import { useMemo, useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";

import type { Package } from "@/lib/parser/types";
import type { TreeNode } from "@/types/tree";

import { buildTree } from "@/lib/workspace/buildTree";

import TreeNodeView from "./TreeNode";
import DetailsPanel from "@/lib/workspace/DetailsPanel";

import { EDILine } from "@/types/edi";

type Props = {
  messageType: string;

  packages: Package[];

  lines: EDILine[];

  expanded: boolean;

  onToggle(): void;
};

export default function PackagesWorkspace({
  messageType,
  packages,
  lines,
  expanded,
  onToggle,
}: Props) {
  const tree = useMemo(
    () => buildTree(messageType, packages, lines),
    [messageType, packages, lines],
  );

  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);

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

      <div className="grid flex-1 grid-cols-2 overflow-hidden">
        {/* Tree */}

        <div className="overflow-auto border-r border-zinc-800 p-3">
          <div className="space-y-1">
            {tree.map((node) => (
              <TreeNodeView
                key={node.id}
                node={node}
                onSelect={setSelectedNode}
              />
            ))}
          </div>
        </div>

        {/* Details */}

        <div className="overflow-auto p-6">
          <DetailsPanel node={selectedNode} />
        </div>
      </div>
    </div>
  );
}
