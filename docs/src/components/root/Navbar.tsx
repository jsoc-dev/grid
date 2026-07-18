import { ThemeToggle } from "@/components/root/ThemeToggle";
import { Navbar as NextraNavbar } from "nextra-theme-docs";

export function Navbar() {
  return (
    <NextraNavbar
      logo={<></>}
      projectLink="https://github.com/jsoc-dev/grid"
      align="left"
    >
      <ThemeToggle />
    </NextraNavbar>
  );
}
