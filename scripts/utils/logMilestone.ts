export function logMilestone(message: string, variant?: "start" | "end") {
  const timestamp = new Date().toLocaleTimeString();
  const padded = `   ${message}   `;
  const line = "═".repeat(padded.length + 10);

  const colors = {
    start: "\x1b[33m",
    end: "\x1b[32m",
    reset: "\x1b[0m",
  };

  const color = variant ? colors[variant] : "";

  console.log();
  console.log(paint(line, color));
  console.log(paint(`⏱ ${timestamp} ${padded}`, color));
  console.log(paint(line, color));
  console.log();
}

export function paint(text: string, color = "") {
  return color ? `${color}${text}\x1b[0m` : text;
}
