import { JsocGridText } from "@/components/root/navbar/JsocGridText";
import { MoveRight } from "lucide-react";
import Link from "next/link";

const tagline = "Runtime config generator for datagrids";

const description =
  "JSOC Grid analyses JSON data at runtime and generates necessary configurations like rows and columns automatically for a grid component.";

export function HeroSection() {
  return (
    <div className="relative isolate">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full">
        <div
          className="absolute inset-0 grid-pattern text-black dark:text-white opacity-[0.25] dark:opacity-[0.35]"
          style={{
            maskImage:
              "linear-gradient(to bottom, white 0%, white 40%, transparent 100%), linear-gradient(to right, white 0%, white 10%, transparent 35%, transparent 65%, white 90%, white 100%)",
            WebkitMaskComposite: "source-in",
            maskComposite: "intersect",
          }}
        />
      </div>

      <section className="relative pt-20 pb-16 lg:pt-32 lg:pb-20">
        <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <JsocGridText
            as="h1"
            className="mb-6 text-5xl sm:text-6xl md:text-8xl lg:text-9xl"
          />

          <p className="mx-auto mb-10 text-xl font-bold  md:text-4xl">
            {tagline}
          </p>

          <p className="mx-auto mb-10 max-w-2xl text-lg md:text-xl">
            {description}
          </p>

          <div className="flex items-center justify-center">
            <Link
              href="/react-grid/getting-started"
              className="group flex h-11 items-center justify-center gap-2 rounded-full bg-accent-600 px-7 text-sm font-semibold text-white transition-all hover:bg-accent-500 active:scale-95"
            >
              Get Started
              <MoveRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
