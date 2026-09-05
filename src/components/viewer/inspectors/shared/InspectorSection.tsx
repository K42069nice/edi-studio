import FieldCard from "./FieldCard";

type Field = {
  label: string;
  value?: string | null;
  segment?: string;
  searchValue?: string;
};

type Props = {
  title: string;
  fields: Field[];
};

export default function InspectorSection({ title, fields }: Props) {
  const visibleFields = fields.filter((field) => field.value);

  if (visibleFields.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900">
      <div className="border-b border-zinc-800 px-4 py-2">
        <h3 className="text-base font-semibold text-white">{title}</h3>
      </div>

      <div className="divide-y divide-zinc-800">
        {visibleFields.map((field, index) => (
          <FieldCard
            key={`${field.label}-${index}`}
            label={field.label}
            value={field.value ?? undefined}
            segment={field.segment}
            searchValue={field.searchValue}
          />
        ))}
      </div>
    </div>
  );
}
