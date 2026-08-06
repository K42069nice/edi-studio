export function formatDate(value: string | null): string | null {
  if (!value || value.length !== 8) {
    return value;
  }

  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(4, 6)) - 1;
  const day = Number(value.slice(6, 8));

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(year, month, day));
}

export function cleanParty(value: string | null): string | null {
  if (!value) {
    return null;
  }

  return value.replace(/::9$/, "");
}
