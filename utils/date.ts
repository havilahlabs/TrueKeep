export function prettyDate(input: string): string {
  return new Date(input).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
