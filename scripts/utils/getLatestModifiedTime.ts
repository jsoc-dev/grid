import { REPO_DIR } from "#repo.ts";
import { findPackageDirectories } from "#scripts/utils/findPackageDirectories.ts";
import { getPackageJson } from "#scripts/utils/getPackageJson.ts";

import { readdir, stat } from "node:fs/promises";
import path from "node:path";

let cachedWorkspacePackages: Map<string, string> | null = null;

async function getWorkspacePackagesMap(): Promise<Map<string, string>> {
  if (cachedWorkspacePackages) {
    return cachedWorkspacePackages;
  }
  const map = new Map<string, string>();
  const packagesDir = path.resolve(REPO_DIR, "packages");
  const packageDirs = await findPackageDirectories(packagesDir);
  for (const dir of packageDirs) {
    const pkgJson = getPackageJson(dir);
    if (pkgJson && pkgJson.name) {
      map.set(pkgJson.name, dir);
    }
  }
  cachedWorkspacePackages = map;
  return map;
}

async function getExampleWorkspaceDependencies(
  sourceDir: string,
): Promise<string[]> {
  const workspaceMap = await getWorkspacePackagesMap();
  const visited = new Set<string>();
  const queue: string[] = [];

  const pkgJson = getPackageJson(sourceDir);
  if (pkgJson) {
    const deps = { ...pkgJson.dependencies, ...pkgJson.devDependencies };
    for (const depName of Object.keys(deps)) {
      if (workspaceMap.has(depName)) {
        queue.push(depName);
        visited.add(depName);
      }
    }
  }

  let head = 0;
  while (head < queue.length) {
    const currentDep = queue[head++];
    const depDir = workspaceMap.get(currentDep)!;
    const depPkgJson = getPackageJson(depDir);
    if (depPkgJson) {
      const deps = {
        ...depPkgJson.dependencies,
        ...depPkgJson.devDependencies,
      };
      for (const depName of Object.keys(deps)) {
        if (workspaceMap.has(depName) && !visited.has(depName)) {
          queue.push(depName);
          visited.add(depName);
        }
      }
    }
  }

  return Array.from(visited).map((name) => workspaceMap.get(name)!);
}

async function getDirectoryLatestModifiedTime(
  dir: string,
  includeDirMtime: boolean,
): Promise<number> {
  let maxTime = 0;

  if (includeDirMtime) {
    try {
      const dirStat = await stat(dir);
      maxTime = dirStat.mtimeMs;
    } catch {
      // Ignore if dir doesn't exist for some reason
    }
  }

  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.resolve(dir, entry.name);
    if (entry.name === "node_modules" || entry.name === "dist") continue;
    if (entry.isDirectory()) {
      const time = await getDirectoryLatestModifiedTime(fullPath, false);
      maxTime = Math.max(maxTime, time);
    } else {
      const stats = await stat(fullPath);
      maxTime = Math.max(maxTime, stats.mtimeMs);
    }
  }
  return maxTime;
}

export async function getLatestModifiedTime(
  sourceDir: string,
): Promise<number> {
  let maxTime = await getDirectoryLatestModifiedTime(sourceDir, true);

  const depDirs = await getExampleWorkspaceDependencies(sourceDir);
  for (const depDir of depDirs) {
    const depTime = await getDirectoryLatestModifiedTime(depDir, false);
    maxTime = Math.max(maxTime, depTime);
  }

  return maxTime;
}
