"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Package, FileText } from "lucide-react";

import { TreeNode as Node } from "@/types/tree";

type Props = {
  node: Node;
  onSelect(node: Node): void;
};

export default function TreeNode({ node, onSelect }: Props) {
  const [expanded, setExpanded] = useState(true);

  const hasChildren = node.children.length > 0;

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          onSelect(node);

          if (hasChildren) {
            setExpanded((v) => !v);
          }
        }}
        className="
          flex
          w-full
          items-start
          gap-2
          rounded-lg
          px-3
          py-2
          transition
          hover:bg-zinc-800/40
        "
      >
        {hasChildren ? (
          expanded ? (
            <ChevronDown size={15} className="mt-1 shrink-0 text-zinc-500" />
          ) : (
            <ChevronRight size={15} className="mt-1 shrink-0 text-zinc-500" />
          )
        ) : (
          <div className="w-[15px]" />
        )}

        {node.type === "package" ? (
          <Package size={16} className="mt-1 shrink-0 text-amber-400" />
        ) : (
          <FileText size={16} className="mt-1 shrink-0 text-sky-400" />
        )}

        <div className="min-w-0 flex-1 text-left">
          <div className="truncate text-sm font-medium text-white">
            {node.title}
          </div>

          {node.subtitle && (
            <div className="truncate text-xs text-zinc-500">
              {node.subtitle}
            </div>
          )}
        </div>

        {node.badge && (
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
              text-zinc-400
            "
          >
            {node.badge}
          </span>
        )}
      </button>

      {expanded && hasChildren && (
        <div className="ml-6 border-l border-zinc-800 pl-3">
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
}
