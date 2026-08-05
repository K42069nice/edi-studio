export type CompareRow = {
  left: string;
  right: string;

  leftLine: number | null;
  rightLine: number | null;

  type: "equal" | "added" | "removed" | "changed";
};

export type CompareEngineResult = {
  rows: CompareRow[];

  leftText: string;

  rightText: string;
};

function getSegment(line?: string) {
  if (!line) return "";

  return line.split("+")[0];
}

export function compareEngine(
  left: string,
  right: string,
): CompareEngineResult {
  const leftLines = left.replace(/\r/g, "").split("\n");

  const rightLines = right.replace(/\r/g, "").split("\n");

  const rows: CompareRow[] = [];

  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < leftLines.length || rightIndex < rightLines.length) {
    const leftLine = leftLines[leftIndex];

    const rightLine = rightLines[rightIndex];

    if (leftLine === undefined && rightLine === undefined) {
      break;
    }

    // --------------------------------
    // Equal
    // --------------------------------

    if (leftLine === rightLine) {
      rows.push({
        left: leftLine ?? "",
        right: rightLine ?? "",

        leftLine: leftLine == null ? null : leftIndex + 1,

        rightLine: rightLine == null ? null : rightIndex + 1,

        type: "equal",
      });

      leftIndex++;
      rightIndex++;

      continue;
    }

    // --------------------------------
    // Added / Removed
    // --------------------------------

    const LOOK_AHEAD = 20;

    let rightMatch = -1;

    for (
      let i = rightIndex + 1;
      i < Math.min(rightLines.length, rightIndex + LOOK_AHEAD);
      i++
    ) {
      if (getSegment(rightLines[i]) === getSegment(leftLine)) {
        rightMatch = i;
        break;
      }
    }

    let leftMatch = -1;

    for (
      let i = leftIndex + 1;
      i < Math.min(leftLines.length, leftIndex + LOOK_AHEAD);
      i++
    ) {
      if (getSegment(leftLines[i]) === getSegment(rightLine)) {
        leftMatch = i;
        break;
      }
    }

    // строки есть только справа
    if (
      rightMatch !== -1 &&
      (leftMatch === -1 || rightMatch - rightIndex <= leftMatch - leftIndex)
    ) {
      while (rightIndex < rightMatch) {
        rows.push({
          left: "",
          right: rightLines[rightIndex],

          leftLine: null,
          rightLine: rightIndex + 1,

          type: "added",
        });

        rightIndex++;
      }

      continue;
    }

    // строки есть только слева
    if (leftMatch !== -1) {
      while (leftIndex < leftMatch) {
        rows.push({
          left: leftLines[leftIndex],
          right: "",

          leftLine: leftIndex + 1,
          rightLine: null,

          type: "removed",
        });

        leftIndex++;
      }

      continue;
    }

    // --------------------------------
    // Changed
    // --------------------------------

    const leftTag = getSegment(leftLine);
    const rightTag = getSegment(rightLine);

    if (
      leftTag &&
      leftTag === rightTag &&
      rightMatch === -1 &&
      leftMatch === -1
    ) {
      rows.push({
        left: leftLine ?? "",
        right: rightLine ?? "",

        leftLine: leftIndex + 1,
        rightLine: rightIndex + 1,

        type: "changed",
      });

      leftIndex++;
      rightIndex++;

      continue;
    }

    // --------------------------------
    // Fallback
    // --------------------------------

    rows.push({
      left: leftLine ?? "",
      right: rightLine ?? "",

      leftLine: leftLine == null ? null : leftIndex + 1,

      rightLine: rightLine == null ? null : rightIndex + 1,

      type: "changed",
    });

    leftIndex++;
    rightIndex++;
  }
  return {
    rows,

    leftText: rows.map((r) => r.left).join("\n"),

    rightText: rows.map((r) => r.right).join("\n"),
  };
}
