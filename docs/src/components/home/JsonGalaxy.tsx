"use client";

import clsx from "clsx";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";

// Grid geometry copied from VS Code's SessionsChatBackgroundRenderer
// (src/vs/sessions/services/chatBackground/browser/chatBackgroundRenderer.ts):
// fixed-size cells over the measured container instead of a repeating SVG
// tile, so the field never visibly repeats horizontally.
const CELL_SIZE = 80;
const FALLBACK_WIDTH = 960;
const FALLBACK_HEIGHT = 800;

// Show/hide choreography: glyphs fade in deterministic groups so the field
// dissolves and re-forms in waves instead of all at once.
const FADE_GROUPS = 6;
const FADE_STEP_MS = 120;
const FADE_DURATION_MS = 500;
const HIDE_TOTAL_MS = (FADE_GROUPS - 1) * FADE_STEP_MS + FADE_DURATION_MS + 50;

type GalaxyGlyph = {
  key: string;
  char: string;
  left: number;
  top: number;
  size: number;
  rotation: number;
  opacity: number;
  twinkle: boolean;
  twinkleDuration: number;
  twinkleDelay: number;
  fadeGroup: number;
};

export type JsonGalaxyProps = {
  className?: string;
  visible: boolean;
};

export function JsonGalaxy({ className, visible }: JsonGalaxyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Server + first client paint agree on the fallback grid (same as VS Code's
  // 960x800 defaults), then the observer corrects to the measured size.
  const [gridSize, setGridSize] = useState(() => ({
    columns: Math.ceil(FALLBACK_WIDTH / CELL_SIZE),
    rows: Math.ceil(FALLBACK_HEIGHT / CELL_SIZE),
  }));
  const gridSizeRef = useRef(`${gridSize.columns}x${gridSize.rows}`);
  // GalaxyGlyphs stay unmounted while hidden (the default), so the idle page
  // carries no twinkle cost. Fading out keeps them mounted until the last
  // group finishes; fading in mounts at opacity 0 and flips on after paint.
  const [renderGlyphs, setRenderGlyphs] = useState(false);
  const [fadedIn, setFadedIn] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    const update = (width: number, height: number) => {
      const columns = Math.max(
        1,
        Math.ceil((width || FALLBACK_WIDTH) / CELL_SIZE),
      );
      const rows = Math.max(
        1,
        Math.ceil((height || FALLBACK_HEIGHT) / CELL_SIZE),
      );
      const next = `${columns}x${rows}`;
      if (next !== gridSizeRef.current) {
        gridSizeRef.current = next;
        setGridSize({ columns, rows });
      }
    };
    update(container.clientWidth, container.clientHeight);
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        update(entry.contentRect.width, entry.contentRect.height);
      }
    });
    observer.observe(container);
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!visible) {
      // Opacity already derives to 0 from the prop flip; just unmount (and
      // reset the fade flag) once the last group has finished.
      const timer = setTimeout(() => {
        setRenderGlyphs(false);
        setFadedIn(false);
      }, HIDE_TOTAL_MS);
      return () => {
        clearTimeout(timer);
      };
    }
    // Mount first (opacity 0 while fadedIn is false), then flip on after
    // paint so the staggered transition actually runs.
    let secondFrame = 0;
    const firstFrame = requestAnimationFrame(() => {
      setRenderGlyphs(true);
      secondFrame = requestAnimationFrame(() => {
        setFadedIn(true);
      });
    });
    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
    };
  }, [visible]);

  const glyphs = useMemo(
    () => generateGalaxyGlyphs(gridSize.columns, gridSize.rows),
    [gridSize.columns, gridSize.rows],
  );

  return (
    <div
      aria-hidden="true"
      ref={containerRef}
      className={clsx(
        "pointer-events-none absolute inset-0 -z-10 select-none overflow-hidden",
        className,
      )}
      style={{
        maskImage:
          "linear-gradient(to bottom, black 0%, black 72%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, black 0%, black 72%, transparent 100%)",
      }}
    >
      <div className="absolute inset-0 text-neutral-800 dark:text-white">
        {renderGlyphs &&
          glyphs.map((g) => (
            <span
              key={g.key}
              className="json-galaxy-fade absolute"
              style={{
                left: `${g.left}px`,
                top: `${g.top}px`,
                transform: `translate(-50%, -50%) rotate(${g.rotation}deg)`,
                opacity: fadedIn && visible ? 1 : 0,
                transitionDelay: `${g.fadeGroup * FADE_STEP_MS}ms`,
              }}
            >
              <span
                className={clsx(
                  "json-galaxy-glow",
                  g.twinkle && "json-galaxy-twinkle",
                )}
                style={galaxyGlyphStyle(g)}
              >
                {g.char}
              </span>
            </span>
          ))}
      </div>
    </div>
  );
}

// Deterministic cell hash copied from VS Code's hashCodiconCell: pure
// function of (row, column, salt), so glyphs stay stable across resizes.
function hashPatternCell(row: number, column: number, salt: number): number {
  let value =
    Math.imul(row + 1, 73856093) ^
    Math.imul(column + 1, 19349663) ^
    Math.imul(salt + 1, 83492791);
  value = Math.imul(value ^ (value >>> 13), 1540483477);
  return (value ^ (value >>> 15)) >>> 0;
}

// weighted pool: clusters "[]" "{}" dominate, singles + punctuation fill gaps
const POOL: string[] = [
  "[]",
  "{}",
  "[]",
  "{}",
  "[]",
  "{}",
  "[]",
  "{}",
  "{}",
  "[]",
  "[ ]",
  "{ }",
  "[",
  "]",
  "{",
  "}",
  ":",
  ",",
  '"',
  ":",
];

function generateGalaxyGlyphs(columns: number, rows: number): GalaxyGlyph[] {
  const glyphs: GalaxyGlyph[] = [];
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      // skip ~1/9 of cells for sparsity, like VS Code
      if (hashPatternCell(row, column, 0) % 9 === 0) {
        continue;
      }
      const char = POOL[hashPatternCell(row, column, 1) % POOL.length];
      const isPair = char.length === 2;
      const size = isPair
        ? 10 + (hashPatternCell(row, column, 2) % 3) // 10-12
        : 10 + (hashPatternCell(row, column, 2) % 4); // 10-13
      const horizontalOffset =
        ((hashPatternCell(row, column, 3) % 71) - 35) / 100;
      const verticalOffset =
        ((hashPatternCell(row, column, 4) % 65) - 32) / 100;
      const rotation = (hashPatternCell(row, column, 5) % 71) - 35;
      // Faint field texture — twinkle peaks punch through to near-white
      // separately in the keyframes, so no container opacity cap is needed.
      const opacity = 0.1 + (hashPatternCell(row, column, 6) % 16) / 100; // 0.10-0.25
      // ~65% of glyphs twinkle; the rest stay static so the field never
      // pulses as one. Duration + negative delay spread phases deterministically.
      const twinkle = hashPatternCell(row, column, 7) % 20 < 13;
      const twinkleDuration = 3 + (hashPatternCell(row, column, 8) % 40) / 10; // 3.0-6.9s
      const twinkleDelay = -(hashPatternCell(row, column, 9) % 70) / 10; // 0 to -6.9s
      const fadeGroup = hashPatternCell(row, column, 10) % FADE_GROUPS;
      glyphs.push({
        key: `${row}:${column}`,
        char,
        left: (column + 0.5 + horizontalOffset) * CELL_SIZE,
        top: (row + 0.5 + verticalOffset) * CELL_SIZE,
        size,
        rotation,
        opacity,
        twinkle,
        twinkleDuration,
        twinkleDelay,
        fadeGroup,
      });
    }
  }
  return glyphs;
}

const GALAXY_FONT_FAMILY =
  "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";

type GalaxyGlyphStyle = CSSProperties & {
  "--galaxy-opacity": number;
  "--twinkle-duration"?: string;
  "--twinkle-delay"?: string;
};

// Opacity animates on the inner span (positioning transform stays on the
// outer), so twinkling stays on the compositor. Static glyphs keep their
// hashed opacity; twinkling ones oscillate around it via the keyframes.
function galaxyGlyphStyle(g: GalaxyGlyph): GalaxyGlyphStyle {
  const style: GalaxyGlyphStyle = {
    fontFamily: GALAXY_FONT_FAMILY,
    fontSize: `${g.size}px`,
    fontWeight: 400,
    "--galaxy-opacity": g.opacity,
  };
  if (g.twinkle) {
    style["--twinkle-duration"] = `${g.twinkleDuration}s`;
    style["--twinkle-delay"] = `${g.twinkleDelay}s`;
  } else {
    style.opacity = g.opacity;
  }
  return style;
}
