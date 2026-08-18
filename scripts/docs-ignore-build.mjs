import { execFileSync } from "node:child_process";

const previousSha = process.env.VERCEL_GIT_PREVIOUS_SHA;
const currentSha = process.env.VERCEL_GIT_COMMIT_SHA;

const paths = [
  "docs",
  "packages",
  "examples",
  "scripts",
  "package.json",
  "pnpm-lock.yaml",
  "pnpm-workspace.yaml",
];

const IGNORE_BUILD = 0;
const CONTINUE_BUILD = 1;

// No previous/current commit → don't ignore.
if (!previousSha || !currentSha) {
  process.exit(CONTINUE_BUILD);
}

let result = checkDiff();

if (result === "missing") {
  try {
    execFileSync("git", ["fetch", "--no-tags", "origin", previousSha], {
      stdio: "inherit",
    });
  } catch {
    // If we can't fetch the previous commit, build safely.
    process.exit(CONTINUE_BUILD);
  }

  result = checkDiff();
}

if (result === "unchanged") {
  process.exit(IGNORE_BUILD);
}

// Changes exist, or we couldn't safely determine otherwise.
process.exit(CONTINUE_BUILD);

/**
 * Check the difference between the previous and current commit.
 *
 * @returns {"unchanged"|"changed"|"missing"}
 */
function checkDiff() {
  try {
    execFileSync(
      "git",
      ["diff", "--quiet", previousSha, currentSha, "--", ...paths],
      {
        stdio: "ignore",
      },
    );

    // No relevant changes.
    return "unchanged";
  } catch (error) {
    if (error.status === 1) {
      // Relevant changes exist.
      return "changed";
    }

    if (error.status === 128) {
      // Previous SHA isn't available locally.
      return "missing";
    }

    // Unexpected Git error → build safely.
    return "changed";
  }
}
