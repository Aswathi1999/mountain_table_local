/** Splits "Jeep Safari (On Request)" into the big title and its smaller parenthesised qualifier. */
export function splitTitle(title: string): [string, string | null] {
  const match = title.match(/^(.*?)\s*(\(.*\))$/);
  return match ? [match[1], match[2]] : [title, null];
}
