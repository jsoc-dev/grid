#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const getModulePath = (m) => fileURLToPath(import.meta.resolve(m));

// path to the build script
const buildScriptPath = getModulePath("#scripts/build-packages.ts");

// path to the tsx cli module (tsx/cli.mjs)
const tsxCliPath = getModulePath("tsx/cli");

// additional arguments to pass to the build script
const buildScriptArgs = process.argv.slice(2);

// This starts a child Node process that runs build script through tsx,
// the same way as: node path/to/tsx/cli path/to/build-script [args...]
// spawnSync is used as there is no other async work to do
const result = spawnSync(
  process.execPath, // The Node executable
  [tsxCliPath, buildScriptPath, ...buildScriptArgs],
  {
    stdio: "inherit", // Logs and errors from tsdown/tsx go straight to the terminal
    env: process.env, // Pass through the environment variables
  },
);

process.exit(result.status ?? 1);
