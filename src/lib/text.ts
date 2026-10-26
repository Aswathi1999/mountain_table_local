/** "THATCHED ELEGANCE:" to "Thatched elegance:". The site's copy is stored in capitals; display type reads better in sentence case. */
export function sentenceCase(text: string): string {
  const lower = text.trim().toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

/** "OUR ROOMS" to "Our Rooms". */
export function titleCase(text: string): string {
  return text
    .toLowerCase()
    .split(" ")
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(" ");
}
