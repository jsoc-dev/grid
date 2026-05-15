import { JsocGridText } from "./JsocGridText";
import { ThemeToggle } from "./ThemeToggle";
import { Navbar as NextraNavbar } from "nextra-theme-docs";

export function Navbar() {
  return (
    <NextraNavbar
      logo={<JsocGridText className="text-2xl md:text-3xl" />}
      projectLink="https://github.com/jsoc-dev/grid"
    >
      <ThemeToggle />
    </NextraNavbar>
  );
}
