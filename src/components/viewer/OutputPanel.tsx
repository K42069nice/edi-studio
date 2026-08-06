"use client";

import { EDIAnalysis } from "@/types/edi";
import { useEditor } from "@/context/EditorContext";
import { useState } from "react";
import DESADVInspector from "./desadv/DESADVInspector";

type Props = {
  analysis: EDIAnalysis;
};

export default function OutputPanel({ analysis }: Props) {
  const { scrollToValue } = useEditor();
  const [activeValue, setActiveValue] = useState<string | null>(null);

  if (analysis.messageType === "DESADV") {
    return <DESADVInspector analysis={analysis} />;
  }

  if (!analysis.messageType) {
    return (
      <div className="h-full rounded-xl border border-zinc-800 bg-zinc-900">
        <div className="border-b border-zinc-800 px-5 py-4">
          <h2 className="text-lg font-semibold text-white">Inspector</h2>
        </div>

        <div className="flex h-[500px] items-center justify-center px-8 text-center">
          <div>
            <div className="mb-4 text-6xl">📄</div>

            <h3 className="text-lg font-medium text-white">
              No document loaded
            </h3>

            <p className="mt-2 text-sm text-zinc-500">
              Open or drag an EDIFACT file into the editor to inspect its
              contents.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Inspector Header */}

      <div className="rounded-xl border border-zinc-800 bg-zinc-900">
        <div className="border-b border-zinc-800 px-5 py-4">
          <h2 className="text-lg font-semibold text-white">Inspector</h2>
        </div>

        <div className="space-y-3 p-5">
          <div className="flex justify-between">
            <span className="text-zinc-500">Message Type</span>

            <span className="font-semibold text-white">
              {analysis.messageType}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-500">Version</span>

            <span className="font-semibold text-white">
              {analysis.version ?? "-"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-500">Segments</span>

            <span className="font-semibold text-white">
              {analysis.segments}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-500">Status</span>

            <span className="font-semibold text-green-400">
              {analysis.status}
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic Sections */}

      {analysis.sections.map((section) => (
        <div
          key={section.id}
          className="rounded-xl border border-zinc-800 bg-zinc-900"
        >
          <div className="border-b border-zinc-800 px-5 py-3">
            <h3 className="font-semibold text-white">{section.title}</h3>
          </div>

          <div className="divide-y divide-zinc-800">
            {section.fields.map((field) => (
              <div
                key={field.label}
                className={`
                    px-5
                    py-4
                    transition-all
                    duration-300
                    ${
                      activeValue === field.value
                        ? "bg-sky-500/10"
                        : "hover:bg-zinc-800/40"
                    }
                  `}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                    {field.label}
                  </span>

                  {field.segment && (
                    <span
                      className="
                          rounded-md
                          border
                          border-sky-500/20
                          bg-sky-500/10
                          px-2
                          py-0.5
                          text-[10px]
                          font-medium
                          uppercase
                          tracking-wide
                          text-sky-300
                        "
                    >
                      {field.segment}
                      {field.qualifier ? ` • ${field.qualifier}` : ""}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const value = String(field.value ?? "").trim();

                    if (!value) return;

                    setActiveValue(value);
                    scrollToValue(value);

                    setTimeout(() => {
                      setActiveValue(null);
                    }, 250);
                  }}
                  className={`
                      text-left
                      font-mono
                      text-lg
                      font-semibold
                      transition-all
                      duration-200
                      ${
                        activeValue === field.value
                          ? "text-sky-300 scale-[1.03]"
                          : "text-white hover:text-sky-300"
                      }
                    `}
                >
                  {field.value ?? "-"}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
