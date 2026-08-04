"use client";

import { LoadedFile } from "@/types/file";

type Props = {
  loadedFile: LoadedFile | null;
};

export default function TopNavigation({
  loadedFile,
}: Props) {
  return (
    <header className="border-b border-zinc-800 bg-zinc-900">

      <div className="px-8 pt-5">

        {/* Title */}

        <div className="flex items-center gap-3">

          <h1 className="text-2xl font-bold tracking-tight text-white">
            EDI Studio
          </h1>

          <span className="text-zinc-600">/</span>

          <span className="text-sm text-zinc-500">
            {loadedFile?.name ?? "No file opened"}
          </span>

        </div>

        {/* Navigation */}

        <nav className="mt-6 flex gap-8">

          <button
            className="
              border-b-2
              border-zinc-100
              pb-3
              text-sm
              font-medium
              text-white
            "
          >
            Viewer
          </button>

          <button
            className="
              border-b-2
              border-transparent
              pb-3
              text-sm
              text-zinc-400
              transition-colors
              hover:text-white
            "
          >
            Compare
          </button>

        </nav>

      </div>

    </header>
  );
}