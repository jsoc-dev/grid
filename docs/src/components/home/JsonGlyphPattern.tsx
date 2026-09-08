const TILE_W = 380;
const TILE_H = 280;

type Glyph = {
  x: number;
  y: number;
  char: string;
  size: number;
  opacity: number;
};

// deterministic PRNG – same on server & client → no hydration mismatch
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
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

function generateGlyphs(): Glyph[] {
  const rand = mulberry32(0x4a6f7343);
  const glyphs: Glyph[] = [];
  const count = 96;

  for (let i = 0; i < count; i++) {
    const char = POOL[Math.floor(rand() * POOL.length)];
    // keep pairs slightly larger
    const isPair = char.length === 2;
    const size = isPair
      ? 10 + Math.floor(rand() * 3) // 10-12
      : 10 + Math.floor(rand() * 4); // 10-13
    const x = Math.floor(rand() * (TILE_W - 24));
    // y baseline: avoid clipping top, keep within tile
    const y = 14 + Math.floor(rand() * (TILE_H - 20));
    const opacity = 0.35 + rand() * 0.55; // 0.35 - 0.9 per-glyph variation
    glyphs.push({ x, y, char, size, opacity });
  }

  return glyphs;
}

const GLYPHS = generateGlyphs();

export function JsonGlyphPattern() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 select-none overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to bottom, black 0%, black 72%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, black 0%, black 72%, transparent 100%)",
      }}
    >
      <svg
        className="absolute inset-0 h-full w-full text-neutral-800 dark:text-white"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id="hero-json-pattern"
            width={TILE_W}
            height={TILE_H}
            patternUnits="userSpaceOnUse"
            patternContentUnits="userSpaceOnUse"
          >
            {GLYPHS.map((g, i) => (
              <text
                key={i}
                x={g.x}
                y={g.y}
                fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
                fontSize={g.size}
                fill="currentColor"
                opacity={g.opacity}
                style={{ fontWeight: 400 }}
              >
                {g.char}
              </text>
            ))}
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#hero-json-pattern)"
          className="opacity-[0.18] dark:opacity-[0.14]"
        />
      </svg>
    </div>
  );
}
