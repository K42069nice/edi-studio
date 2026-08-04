"use client";

import { EDIAnalysis } from "@/types/edi";

type Props = {
  analysis: EDIAnalysis;
};

export default function OutputPanel({ analysis }: Props) {
  if (!analysis.messageType) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 h-full">
        <div className="border-b border-zinc-800 px-5 py-4">
          <h2 className="text-lg font-semibold text-white">
            Inspector
          </h2>
        </div>

        <div className="flex h-[500px] items-center justify-center px-8 text-center">
          <div>
            <div className="text-6xl mb-4">📄</div>

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
    <div className="space-y-5">
      {/* Inspector Header */}

      <div className="rounded-xl border border-zinc-800 bg-zinc-900">
        <div className="border-b border-zinc-800 px-5 py-4">
          <h2 className="text-lg font-semibold text-white">
            Inspector
          </h2>
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
            <h3 className="font-semibold text-white">
              {section.title}
            </h3>
          </div>

          <div className="divide-y divide-zinc-800">
            {section.fields.map((field) => (
              <div
                key={field.label}
                className="flex items-center justify-between px-5 py-3"
              >
                <div>
                  <div className="text-sm text-zinc-400">
                    {field.label}
                  </div>

                  {field.segment && (
                    <div className="mt-1 text-xs text-sky-400">
                      {field.segment}
                      {field.qualifier
                        ? ` • ${field.qualifier}`
                        : ""}
                    </div>
                  )}
                </div>

                <div className="max-w-[50%] text-right font-mono text-sm text-white break-all">
                  {field.value ?? "-"}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}