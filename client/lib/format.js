// Presentation helpers shared across the app.

/** Shorten an address to 0x1234…abcd. */
export const shortenAddress = (address, chars = 4) => {
  if (!address) return "";
  return `${address.slice(0, 2 + chars)}…${address.slice(-chars)}`;
};

/** Trim an ETH balance string to a sensible number of decimals. */
export const formatEth = (value, decimals = 4) => {
  const n = parseFloat(value);
  if (Number.isNaN(n)) return "0";
  return n.toFixed(decimals).replace(/\.?0+$/, "");
};

/** Clamp a funding ratio to an integer percentage between 0 and 100. */
export const fundingPercent = (raised, target) => {
  const r = parseFloat(raised);
  const t = parseFloat(target);
  if (!t || Number.isNaN(r) || Number.isNaN(t)) return 0;
  return Math.min(Math.round((r / t) * 100), 100);
};

/** Truncate a string to a word limit. */
export const truncateWords = (text = "", limit = 24) => {
  const words = text.split(" ");
  return words.length > limit ? `${words.slice(0, limit).join(" ")}…` : text;
};
