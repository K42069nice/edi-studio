import { EDISection } from "@/types/edi";
import FieldCard from "./FieldCard";

type Props = {
  section: EDISection;
};

export default function InspectorSection({ section }: Props) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900">
      <div className="border-b border-zinc-800 px-5 py-3">
        <h3 className="font-semibold text-white">{section.title}</h3>
      </div>

      <div className="divide-y divide-zinc-800">
        {section.fields.map((field) => (
          <FieldCard
            key={field.label}
            label={field.label}
            value={field.value ?? undefined}
            segment={
              field.segment
                ? field.qualifier
                  ? `${field.segment}+${field.qualifier}`
                  : field.segment
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
}
