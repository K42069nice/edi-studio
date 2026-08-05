"use client";

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
};

export default function Switch({ checked, onChange, label }: Props) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`text-sm font-medium transition-colors ${
          checked ? "text-sky-300" : "text-zinc-400"
        }`}
      >
        {label}
      </span>

      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`
          relative
          flex
          h-6
          w-11
          items-center
          rounded-full
          transition-colors
          duration-200
          ${checked ? "bg-sky-500" : "bg-zinc-700"}
        `}
      >
        <span
          className={`
            h-5
            w-5
            rounded-full
            bg-white
            shadow-md
            transition-transform
            duration-200
            ${checked ? "translate-x-5" : "translate-x-0.5"}
          `}
        />
      </button>
    </div>
  );
}
