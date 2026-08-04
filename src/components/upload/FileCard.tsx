import { LoadedFile } from "@/types/file";

type Props = {
  file: LoadedFile | null;
};

function formatFileSize(size: number) {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

export default function FileCard({ file }: Props) {
  if (!file) return null;

  return (
    <div className="mt-5 rounded-md border border-zinc-700 bg-zinc-900">
      <div className="border-b border-zinc-700 px-4 py-2">
        <p className="text-sm font-medium text-zinc-300">Source</p>
      </div>

      <div className="space-y-5 p-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-500">Name</p>

          <p className="mt-1 text-sm text-zinc-100">{file.name}</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-500">Type</p>

          <p className="mt-1 text-sm text-zinc-100">{file.type}</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-500">Size</p>

          <p className="mt-1 text-sm text-zinc-100">
            {formatFileSize(file.size)}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            Encoding
          </p>

          <p className="mt-1 text-sm text-zinc-500">Coming soon</p>
        </div>
      </div>
    </div>
  );
}
