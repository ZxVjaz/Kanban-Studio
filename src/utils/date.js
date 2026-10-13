/**
 * Date formatting and calculation utilities adhering to project standards:
 * - Single date: DD MMM YYYY (e.g., 14 Oct 2026)
 * - Date range: DD MMM YYYY - DD MMM YYYY (e.g., 14 Oct 2026 - 21 Oct 2026)
 */

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

/**
 * Format a YYYY-MM-DD or ISO string into "DD MMM YYYY".
 * @param {string|Date} dateInput
 * @returns {string|null}
 */
export function formatDisplayDate(dateInput) {
  if (!dateInput) return null;

  try {
    const dateObj = typeof dateInput === 'string' && dateInput.includes('-')
      ? parseIsoDateString(dateInput)
      : new Date(dateInput);

    if (Number.isNaN(dateObj.getTime())) return null;

    const day = dateObj.getDate();
    const month = MONTH_NAMES[dateObj.getMonth()];
    const year = dateObj.getFullYear();

    return `${day} ${month} ${year}`;
  } catch {
    return null;
  }
}

/**
 * Format a date range with spaced hyphen delimiter: "DD MMM YYYY - DD MMM YYYY".
 * @param {string|Date} startDate
 * @param {string|Date} endDate
 * @returns {string|null}
 */
export function formatDateRange(startDate, endDate) {
  const formattedStart = formatDisplayDate(startDate);
  const formattedEnd = formatDisplayDate(endDate);

  if (formattedStart && formattedEnd) {
    return `${formattedStart} - ${formattedEnd}`;
  }

  return formattedStart || formattedEnd || null;
}

/**
 * Check if a date string is past today's date.
 * @param {string} dateString YYYY-MM-DD
 * @returns {boolean}
 */
export function isDateOverdue(dateString) {
  if (!dateString) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDate = parseIsoDateString(dateString);
  if (Number.isNaN(targetDate.getTime())) return false;

  return targetDate < today;
}

/**
 * Safely parse YYYY-MM-DD string into a local midnight Date instance.
 * @param {string} dateString 
 * @returns {Date}
 */
function parseIsoDateString(dateString) {
  const cleanDate = dateString.split('T')[0];
  const parts = cleanDate.split('-');
  if (parts.length !== 3) return new Date(NaN);

  const year = Number(parts[0]);
  const month = Number(parts[1]) - 1;
  const day = Number(parts[2]);

  return new Date(year, month, day);
}
