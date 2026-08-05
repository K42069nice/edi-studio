export type CompareType =
  | "equal"
  | "added"
  | "removed"
  | "changed";

export type CompareInline = {
  line: number;
  startColumn: number;
  endColumn: number;
};

export type CompareLine = {
  type: CompareType;

  leftLine: number | null;
  rightLine: number | null;

  leftText: string;
  rightText: string;

  leftInline?: CompareInline;
  rightInline?: CompareInline;
};