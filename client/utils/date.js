// Date helpers for on-chain deadlines (Unix seconds).

/** Convert a yyyy-mm-dd input value to an end-of-day Unix timestamp (seconds). */
export const toUnixDeadline = (dateString) => {
  const date = new Date(dateString);
  date.setHours(23, 59, 59, 999);
  return Math.floor(date.getTime() / 1000);
};

/** Today's date as yyyy-mm-dd, for min= on date inputs. */
export const todayInputValue = () => new Date().toISOString().split("T")[0];

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Format a Unix timestamp (seconds) as "5 Jan 2026". */
export const formatUnixDate = (unixSeconds) => {
  const date = new Date(unixSeconds * 1000);
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
};

/** Format a locale date string "d/m/yyyy" (from the contract read) as "5 Jan 2026". */
export const formatSlashDate = (slashDate) => {
  const [day, month, year] = slashDate.split("/").map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
};

/** Whether a Unix timestamp (seconds) is in the past. */
export const isExpired = (unixSeconds) => Date.now() / 1000 >= unixSeconds;

/** Whether a "d/m/yyyy" date string is in the past. */
export const isSlashDatePassed = (slashDate) => {
  const [day, month, year] = slashDate.split("/").map(Number);
  return Date.now() >= new Date(year, month - 1, day).getTime();
};

/** Days remaining until a Unix deadline; 0 if passed. */
export const daysLeft = (unixSeconds) => {
  const diff = unixSeconds * 1000 - Date.now();
  return diff <= 0 ? 0 : Math.ceil(diff / 86400000);
};
