"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LoadedFile } from "@/types/file";

type Props = {
  loadedFile: LoadedFile | null;
};

export default function TopNavigation({ loadedFile }: Props) {
  const pathname = usePathname();
  return (
    <header className="border-b border-zinc-800 bg-zinc-900">
      <div className="px-8 pt-5">
        {/* Title */}

        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            edi-studio
          </h1>

          <span className="text-zinc-600">/</span>

          <span className="text-sm text-zinc-500">
            {loadedFile?.name ?? "No file opened"}
          </span>
        </div>

        {/* Navigation */}

        <nav className="mt-6 flex gap-8">
          <Link
            href="/"
            className={`
      border-b-2
      pb-3
      text-sm
      font-medium
      transition-colors
      ${
        pathname === "/"
          ? "border-zinc-100 text-white"
          : "border-transparent text-zinc-400 hover:text-white"
      }
    `}
          >
            Viewer
          </Link>

          <Link
            href="/compare"
            className={`
      border-b-2
      pb-3
      text-sm
      font-medium
      transition-colors
      ${
        pathname === "/compare"
          ? "border-zinc-100 text-white"
          : "border-transparent text-zinc-400 hover:text-white"
      }
    `}
          >
            Compare
          </Link>
        </nav>
      </div>
    </header>
  );
}
