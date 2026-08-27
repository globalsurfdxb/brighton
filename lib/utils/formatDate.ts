export function formatDate(date: string | null | undefined) {
  if (!date) return "";

  let d: Date;

  // Handle "DD/MM/YYYY" explicitly
  const dmyMatch = date.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (dmyMatch) {
    const [, day, month, year] = dmyMatch;
    d = new Date(Number(year), Number(month) - 1, Number(day));
  } else {
    d = new Date(date);
  }

  if (isNaN(d.getTime())) return "";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
    .format(d)
    .replace(/\//g, " - ");
}