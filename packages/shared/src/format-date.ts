const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function padTwoDigits(value: number): string {
  return String(value).padStart(2, '0');
}

function parseDate(value: string): Date {
  return new Date(value);
}

function formatTimeOnly(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const meridiem = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${padTwoDigits(minutes)} ${meridiem}`;
}

/** e.g. "21-Jul-2026" */
export function formatDate(dateString: string): string {
  const date = parseDate(dateString);
  return `${padTwoDigits(date.getDate())}-${MONTHS_SHORT[date.getMonth()]}-${date.getFullYear()}`;
}

/** e.g. "21-Jul-2026 14:05" */
export function formatDateTime(dateString?: string | null): string {
  if (!dateString) return '—';
  const date = parseDate(dateString);
  return `${formatDate(dateString)} ${padTwoDigits(date.getHours())}:${padTwoDigits(date.getMinutes())}`;
}

/** e.g. "21-Jul-2026 2:05 PM" */
export function formatDateTimeWithAmPm(dateString?: string | null): string {
  if (!dateString) return '—';
  return `${formatDate(dateString)} ${formatTimeOnly(parseDate(dateString))}`;
}

/** e.g. "2:05 PM" */
export function displayTimeOnly(dateString?: string | null): string {
  if (!dateString) return '—';
  return formatTimeOnly(parseDate(dateString));
}

/** e.g. "21-Jul-2026" (dash fallback for missing values) */
export function displayDateOnly(dateString?: string | null): string {
  if (!dateString) return '-';
  return formatDate(dateString);
}

/** e.g. "Jul 21, 2026" */
export function formatFriendlyDate(dateString?: string | null): string {
  if (!dateString) return '—';
  const date = parseDate(dateString);
  if (Number.isNaN(date.getTime())) return '—';
  return `${MONTHS_SHORT[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

/** e.g. "Jul 21, 2026 · 2:05 PM" */
export function formatFriendlyDateTime(dateString?: string | null): string {
  if (!dateString) return '—';
  const date = parseDate(dateString);
  if (Number.isNaN(date.getTime())) return '—';
  return `${formatFriendlyDate(dateString)} · ${formatTimeOnly(date)}`;
}

/**
 * Collapses a date range into its shortest unambiguous form, e.g.:
 * "Jul 21 – 25, 2026" (same month), "Jul 21 – Aug 3, 2026" (same year),
 * "Dec 21, 2025 – Jan 3, 2026" (spans years).
 */
export function formatFriendlyPeriod(start: string, end: string): string {
  const startDate = parseDate(start);
  const endDate = parseDate(end);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return '—';

  const sameYear = startDate.getFullYear() === endDate.getFullYear();
  const sameMonth = sameYear && startDate.getMonth() === endDate.getMonth();

  if (sameMonth) {
    return `${MONTHS_SHORT[startDate.getMonth()]} ${startDate.getDate()} – ${endDate.getDate()}, ${endDate.getFullYear()}`;
  }
  if (sameYear) {
    return `${MONTHS_SHORT[startDate.getMonth()]} ${startDate.getDate()} – ${MONTHS_SHORT[endDate.getMonth()]} ${endDate.getDate()}, ${endDate.getFullYear()}`;
  }
  return `${MONTHS_SHORT[startDate.getMonth()]} ${startDate.getDate()}, ${startDate.getFullYear()} – ${MONTHS_SHORT[endDate.getMonth()]} ${endDate.getDate()}, ${endDate.getFullYear()}`;
}

/** "yyyy-MM" -> "July 2026" */
export function formatMonthYear(month: string): string {
  const [year, monthNumber] = month.split('-');
  if (!year || !monthNumber) return month;
  const date = new Date(Number(year), Number(monthNumber) - 1, 1);
  if (Number.isNaN(date.getTime())) return month;
  return `${MONTHS_LONG[date.getMonth()]} ${date.getFullYear()}`;
}

/** e.g. "2026-07-21 14:05:09" */
export function timeMM(timestamp: string): string {
  const date = parseDate(timestamp);
  return `${date.getFullYear()}-${padTwoDigits(date.getMonth() + 1)}-${padTwoDigits(date.getDate())} ${padTwoDigits(date.getHours())}:${padTwoDigits(date.getMinutes())}:${padTwoDigits(date.getSeconds())}`;
}

export function getDaySuffix(day: number): string {
  if (day >= 11 && day <= 13) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

/** e.g. "Jul 21st, 2026 13:05:09" (timestamp shifted back one hour) */
export function timeFMM(timestamp: string): string {
  const date = parseDate(timestamp);
  date.setHours(date.getHours() - 1);

  const day = date.getDate();
  const suffix = getDaySuffix(day);

  return `${MONTHS_SHORT[date.getMonth()]} ${day}${suffix}, ${date.getFullYear()} ${padTwoDigits(date.getHours())}:${padTwoDigits(date.getMinutes())}:${padTwoDigits(date.getSeconds())}`;
}

export function getFormattedHour(timestamp: string): string {
  return padTwoDigits(parseDate(timestamp).getHours());
}
