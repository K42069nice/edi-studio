import FieldCard from "./FieldCard";
import { EDILine } from "@/types/edi";

type Props = {
  line: EDILine;
};

export default function LineCard({ line }: Props) {
  return (
    <div className="border-t border-zinc-800 p-5">
      <div className="mb-5 flex items-center justify-between">
        <div className="font-semibold text-sky-300">LIN+{line.lineNumber}</div>

        <div
          className="
          rounded
          border
          border-zinc-700
          bg-zinc-800
          px-2
          py-0.5
          font-mono
          text-[10px]
          text-zinc-300
        "
        >
          LIN+{line.lineNumber}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FieldCard label="GTIN" value={line.gtin} segment="LIN" />

        <FieldCard
          label="Buyer Article"
          value={line.buyerArticle}
          segment="PIA+BP"
        />

        <FieldCard
          label="Supplier Article"
          value={line.supplierArticle}
          segment="PIA+SA"
        />

        <FieldCard label="Description" value={line.description} segment="IMD" />

        <FieldCard
          label="Quantity"
          value={
            line.quantity
              ? `${line.quantity} ${line.quantityUnit ?? ""}`
              : undefined
          }
          segment="QTY+12"
        />

        <FieldCard label="Weight" value={line.weight} segment="MEA" />

        <FieldCard label="Price" value={line.price} segment="PRI" />
      </div>
    </div>
  );
}
