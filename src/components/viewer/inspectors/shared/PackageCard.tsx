import { Package } from "@/lib/parser/types";
import LineCard from "./LineCard";

type Props = {
  pkg: Package;
};

export default function PackageCard({ pkg }: Props) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900">
      <div className="border-b border-zinc-800 px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              Package
            </div>

            <div className="mt-1 font-mono text-sm text-white">
              {pkg.sscc ?? "Unknown SSCC"}
            </div>
          </div>

          <span
            className="
              rounded
              border
              border-zinc-700
              bg-zinc-800
              px-2
              py-1
              font-mono
              text-[10px]
              text-zinc-300
            "
          >
            GIN+BJ
          </span>
        </div>
      </div>

      {pkg.lines.map((line) => (
        <LineCard key={line.lineNumber} line={line} />
      ))}
    </div>
  );
}
