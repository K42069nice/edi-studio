import { EDIAnalysis } from "@/lib/ediParser";

type Props = {
  analysis: EDIAnalysis;
};

export default function OutputPanel({ analysis }: Props) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="mb-4 text-xl font-semibold text-white">Output</h2>

      <div className="space-y-4">
        <div className="rounded-lg bg-slate-950 p-4">
          <p className="text-sm text-slate-400">Buyer</p>
          <p className="mt-1 text-white">{analysis.buyer}</p>
        </div>

        <div className="rounded-lg bg-slate-950 p-4">
          <p className="text-sm text-slate-400">Supplier</p>
          <p className="mt-1 text-white">Coming soon</p>
        </div>

        <div className="rounded-lg bg-slate-950 p-4">
          <p className="text-sm text-slate-400">Message Type</p>
          <p className="mt-1 text-white">{analysis.messageType}</p>
        </div>

        <div className="rounded-lg bg-slate-950 p-4">
          <p className="text-sm text-slate-400">Segments</p>
          <p className="mt-1 text-white">{analysis.segments}</p>
        </div>
      </div>
    </section>
  );
}
