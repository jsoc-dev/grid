import { ThemeToggle } from "@/components/root/ThemeToggle";
import { GITHUB_REPO_BASE_URL } from "@jsoc/grid-docs";
import { Navbar as NextraNavbar } from "nextra-theme-docs";

export function Navbar() {
  return (
    <NextraNavbar logo={<></>} projectLink={GITHUB_REPO_BASE_URL} align="left">
      <ThemeToggle />
    </NextraNavbar>
  );
}
