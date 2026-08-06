type Props = {
  messageType: string;
  version: string | null;
  segments: number;
  status: string;
};

export default function SummaryCard({
  messageType,
  version,
  segments,
  status,
}: Props) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900">
      <div className="border-b border-zinc-800 px-5 py-4">
        <h2 className="text-lg font-semibold text-white">Inspector</h2>
      </div>

      <div className="space-y-2 p-4">
        <Row label="Message Type" value={messageType} />
        <Row label="Version" value={version ?? "-"} />
        <Row label="Segments" value={String(segments)} />
        <Row label="Status" value={status} />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-zinc-500">{label}</span>

      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}
