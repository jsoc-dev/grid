/**
 * Removes the common leading indentation from a block of text lines.
 * This is useful for fixing stale indentation in code snippets while preserving their internal relative indentation.
 */
export function outdentLines(lines: string[]): string[] {
  let minIndent = Infinity;
  for (const line of lines) {
    if (line.trim().length > 0) {
      const match = line.match(/^(\s*)/);
      if (match) {
        minIndent = Math.min(minIndent, match[1].length);
      }
    }
  }

  if (minIndent === Infinity || minIndent === 0) {
    return lines;
  }

  return lines.map((line) =>
    line.length >= minIndent ? line.slice(minIndent) : line,
  );
}
