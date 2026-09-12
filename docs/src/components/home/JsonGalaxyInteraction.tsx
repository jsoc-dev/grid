"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { track } from "@vercel/analytics";
import clsx from "clsx";
import { Telescope as ToggleIcon, CheckIcon, X as XIcon } from "lucide-react";
import { JsonGalaxy } from "@/components/home/JsonGalaxy";

const JSON_GALAXY_STATE_STORAGE_KEY = "jsoc-json-galaxy-state";
const INTERACTION_ANALYTICS_DEBOUNCE_MS = 5000;

const interactionStoreListeners = new Set<() => void>();

const getServerGalaxyStateSnapshot = (): boolean | null => null;

export function JsonGalaxyInteraction() {
  const analyticsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const storedVisible = useSyncExternalStore(
    subscribeToInteractionStore,
    getGalaxyStateSnapshot,
    getServerGalaxyStateSnapshot,
  );

  // Off by default (opt-in like VS Code's decorative backgrounds), so
  // server and first paint always agree and nothing ever flickers away.
  const isGalaxyVisible = storedVisible ?? false;

  useEffect(() => {
    return () => {
      if (analyticsTimerRef.current) {
        clearTimeout(analyticsTimerRef.current);
      }
    };
  }, []);

  const handleToggle = () => {
    const nextVisible = !isGalaxyVisible;

    // Instant UI update and storage persistence
    try {
      localStorage.setItem(
        JSON_GALAXY_STATE_STORAGE_KEY,
        nextVisible ? "on" : "off",
      );
    } catch {
      // Ignore local storage errors
    }

    notifyInteractionStoreListeners();

    // Debounce analytics tracking: wait until toggling stops
    if (analyticsTimerRef.current) {
      clearTimeout(analyticsTimerRef.current);
    }

    analyticsTimerRef.current = setTimeout(() => {
      try {
        track("json-galaxy-interaction", { visible: nextVisible });
      } catch {
        // Ignore analytics failures
      }
    }, INTERACTION_ANALYTICS_DEBOUNCE_MS);
  };

  return (
    // Wrapper gates desktop dark-mode visibility once, so the pattern and
    // toggle button don't repeat the same responsive logic. Bottom-right
    // sits in the hero's padding zone, clear of content at every width.
    <div className="hidden lg:dark:block">
      <JsonGalaxy visible={isGalaxyVisible} />

      <aside
        aria-label="JSON galaxy background preference"
        className="absolute right-6 bottom-4 z-10 flex items-center gap-1"
      >
        <JsonGalaxyToggleButton
          label={
            isGalaxyVisible ? "Stop viewing JSON galaxy" : "View JSON galaxy"
          }
          isSelected={isGalaxyVisible}
          onSelect={handleToggle}
        />
      </aside>
    </div>
  );
}

function JsonGalaxyToggleButton({
  label,
  isSelected,
  onSelect,
}: {
  label: string;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={label}
      aria-pressed={isSelected}
      className={clsx(
        "group relative flex h-8 min-w-8 cursor-pointer items-center justify-center rounded-lg px-2 transition-colors outline-none hover:bg-white/10 focus-visible:ring-1 focus-visible:ring-white/30",
        isSelected ? "text-neutral-100" : "text-neutral-300 hover:text-white",
      )}
    >
      <span className="flex items-center gap-1 w-10">
        <ToggleIcon
          className="size-5 scale-x-[-1]"
          strokeWidth={1.5}
          // fill="currentColor"
        />
        {isSelected ? (
          <CheckIcon className="size-4" strokeWidth={2} />
        ) : (
          <XIcon className="size-4" strokeWidth={2} />
        )}
      </span>
      <span
        role="tooltip"
        className="pointer-events-none absolute right-0 bottom-full mb-2.5 translate-y-0.5 rounded-lg bg-neutral-800 px-3 py-1.5 text-sm whitespace-nowrap text-neutral-100 opacity-0 transition-all duration-150 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
      >
        {label}
        <span
          aria-hidden="true"
          className="absolute top-full right-4 size-2 -translate-y-1/2 translate-x-1/2 rotate-45 bg-neutral-800"
        />
      </span>
    </button>
  );
}

function notifyInteractionStoreListeners() {
  interactionStoreListeners.forEach((listener) => listener());
}

function subscribeToInteractionStore(onStoreChange: () => void) {
  interactionStoreListeners.add(onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    interactionStoreListeners.delete(onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getGalaxyStateSnapshot(): boolean | null {
  try {
    const storedValue = localStorage.getItem(JSON_GALAXY_STATE_STORAGE_KEY);
    if (storedValue === "on") {
      return true;
    }
    if (storedValue === "off") {
      return false;
    }
    return null;
  } catch {
    return null;
  }
}
