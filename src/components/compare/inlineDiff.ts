export type InlineChange = {
  start: number;
  end: number;
};

export function getInlineDiff(
  left: string,
  right: string
) {
  let start = 0;

  while (
    start < left.length &&
    start < right.length &&
    left[start] === right[start]
  ) {
    start++;
  }

  let leftEnd = left.length - 1;
  let rightEnd = right.length - 1;

  while (
    leftEnd >= start &&
    rightEnd >= start &&
    left[leftEnd] === right[rightEnd]
  ) {
    leftEnd--;
    rightEnd--;
  }

  return {
    left: {
      start,
      end: leftEnd + 1,
    },

    right: {
      start,
      end: rightEnd + 1,
    },
  };
}