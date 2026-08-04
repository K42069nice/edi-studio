import { EDIAnalysis, EDIField } from "@/types/edi";

type Props = {
  analysis: EDIAnalysis;
};

function Row({
  label,
  field,
}: {
  label: string;
  field: EDIField | null;
}) {
  if (!field?.value) return null;

  return (
    <button
      type="button"
      className="
        flex
        w-full
        items-center
        justify-between
        rounded-md
        px-2
        py-2
        transition
        hover:bg-zinc-800
      "
    >
      <span className="text-sm text-zinc-500">
        {label}
      </span>

      <span className="text-sm font-medium text-zinc-100">
        {field.value}
      </span>
    </button>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const items = Array.isArray(children)
    ? children.filter(Boolean)
    : [children];

  if (items.length === 0) return null;

  return (
    <div className="mt-6 first:mt-0">
      <div className="mb-3 border-b border-zinc-800 pb-2">
        <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
          {title}
        </p>
      </div>

      <div className="space-y-1">{children}</div>
    </div>
  );
}

export default function OutputPanel({
  analysis,
}: Props) {
  const hasData =
    analysis.messageType ||
    analysis.version ||
    analysis.buyer ||
    analysis.supplier ||
    analysis.documentNumber ||
    analysis.documentDate ||
    analysis.currency;

  return (
    <section className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
      <div className="border-b border-zinc-800 px-6 py-4">
        <h2 className="text-lg font-semibold text-white">
          Inspector
        </h2>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          hasData
            ? "max-h-[1000px] p-6 opacity-100"
            : "max-h-0 p-0 opacity-0"
        }`}
      >
        <Section title="Document">
          <Row
            label="Message Type"
            field={analysis.messageType}
          />

          <Row
            label="Version"
            field={analysis.version}
          />

          <Row
            label="Document No."
            field={analysis.documentNumber}
          />

          <Row
            label="Document Date"
            field={analysis.documentDate}
          />
        </Section>

        <Section title="Parties">
          <Row
            label="Buyer"
            field={analysis.buyer}
          />

          <Row
            label="Supplier"
            field={analysis.supplier}
          />
        </Section>

        <Section title="Financial">
          <Row
            label="Currency"
            field={analysis.currency}
          />
        </Section>

        {analysis.status && (
          <Section title="Message">
            <div className="flex items-center justify-between px-2 py-2">
              <span className="text-sm text-zinc-500">
                Segments
              </span>

              <span className="text-sm font-medium text-zinc-100">
                {analysis.segments}
              </span>
            </div>

            <div className="flex items-center justify-between px-2 py-2">
              <span className="text-sm text-zinc-500">
                Status
              </span>

              <span className="text-sm font-medium text-green-400">
                {analysis.status}
              </span>
            </div>
          </Section>
        )}
      </div>
    </section>
  );
}