import { diffChars, diffLines } from "diff";
import { CompareLine } from "./compareTypes";

export function compareDiff(left: string, right: string): CompareLine[] {
  const changes = diffLines(left, right);

  const result: CompareLine[] = [];

  let leftLine = 1;
  let rightLine = 1;

  for (const part of changes) {
    const lines = part.value.split("\n");

    if (lines[lines.length - 1] === "") {
      lines.pop();
    }

    if (part.added) {
      for (const line of lines) {
        result.push({
          type: "added",
          leftLine: null,
          rightLine,
          leftText: "",
          rightText: line,
        });

        rightLine++;
      }

      continue;
    }

    if (part.removed) {
      for (const line of lines) {
        result.push({
          type: "removed",
          leftLine,
          rightLine: null,
          leftText: line,
          rightText: "",
        });

        leftLine++;
      }

      continue;
    }

    for (const line of lines) {
      result.push({
        type: "equal",
        leftLine,
        rightLine,
        leftText: line,
        rightText: line,
      });

      leftLine++;
      rightLine++;
    }
  }

  // ----------------------------------------
  // removed + added => changed
  // ----------------------------------------

  for (let i = 0; i < result.length - 1; i++) {
    const current = result[i];
    const next = result[i + 1];

    if (current.type === "removed" && next.type === "added") {
      current.type = "changed";
      next.type = "changed";

      current.rightLine = next.rightLine;
      next.leftLine = current.leftLine;

      const chars = diffChars(current.leftText, next.rightText);

      let leftColumn = 1;
      let rightColumn = 1;

      for (const part of chars) {
        const length = part.value.length;

        if (part.removed) {
          current.leftInline = {
            line: current.leftLine!,
            startColumn: leftColumn,
            endColumn: leftColumn + length,
          };

          leftColumn += length;
          continue;
        }

        if (part.added) {
          next.rightInline = {
            line: next.rightLine!,
            startColumn: rightColumn,
            endColumn: rightColumn + length,
          };

          rightColumn += length;
          continue;
        }

        leftColumn += length;
        rightColumn += length;
      }
    }

    if (current.type === "added" && next.type === "removed") {
      current.type = "changed";
      next.type = "changed";

      current.leftLine = next.leftLine;
      next.rightLine = current.rightLine;

      const chars = diffChars(next.leftText, current.rightText);

      let leftColumn = 1;
      let rightColumn = 1;

      for (const part of chars) {
        const length = part.value.length;

        if (part.removed) {
          next.leftInline = {
            line: next.leftLine!,
            startColumn: leftColumn,
            endColumn: leftColumn + length,
          };

          leftColumn += length;
          continue;
        }

        if (part.added) {
          current.rightInline = {
            line: current.rightLine!,
            startColumn: rightColumn,
            endColumn: rightColumn + length,
          };

          rightColumn += length;
          continue;
        }

        leftColumn += length;
        rightColumn += length;
      }
    }
  }

  return result;
}
