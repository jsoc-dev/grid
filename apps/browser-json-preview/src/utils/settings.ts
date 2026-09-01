import type { View } from "#types.ts";

const STORAGE_KEY = "json-preview:default-view";

/**
 * Safely retrieves `window.localStorage`.
 *
 * Accessing `localStorage` can throw a `DOMException: SecurityError` in:
 * - Incognito / Private browsing modes with strict storage partitioning
 * - Opaque origins (e.g. `file:///`, `data:` URIs, sandboxed iframes)
 * - Environments where storage access is blocked by browser privacy policies
 */
function getLocalStorageSafely(): Storage | null {
  try {
    return typeof window !== "undefined" ? window.localStorage : null;
  } catch {
    return null;
  }
}

export function getDefaultViewSetting(): View {
  const storage = getLocalStorageSafely();
  const value = storage?.getItem(STORAGE_KEY);
  return value === "table" ? "table" : "raw";
}

export function setDefaultViewSetting(view: View): void {
  const storage = getLocalStorageSafely();
  try {
    storage?.setItem(STORAGE_KEY, view);
  } catch {
    // Ignore storage quota errors; storage.setItem() can throw QuotaExceededError
    // when the origin's 5MB storage limit has been filled by the host webpage.
  }
}
