type Props = {
  onBrowse: () => void;
  isDragActive: boolean;
};

export default function EditorPlaceholder({ onBrowse, isDragActive }: Props) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div
        onClick={onBrowse}
        className={`
          pointer-events-auto
          cursor-pointer
          rounded-lg
          border-2
          border-dashed
          px-12
          py-8
          text-center
          transition-all
          duration-200
          ${
            isDragActive
              ? "border-zinc-300 bg-zinc-900/80"
              : "border-transparent"
          }
        `}
      >
        <p
          className={`
            text-lg
            font-medium
            ${isDragActive ? "text-zinc-100" : "text-zinc-500"}
          `}
        >
          Drop file here
        </p>

        <p className="mt-2 text-sm text-zinc-500">or click to browse</p>
      </div>
    </div>
  );
}
