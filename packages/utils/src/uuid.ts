/**
 * Produces a random UUID string.
 */
export function uuid(): string {
  // `crypto.randomUUID` requires a secure context like https://example.com or http://localhost
  // It is not available in http://example.com  or http://192.168.x.x
  if (typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  // temporary workaround
  const bytes = crypto.getRandomValues(new Uint8Array(16));

  // RFC4122 v4 adjustments
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
