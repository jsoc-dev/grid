import { REPO_DIR } from "#repo.ts";
import { findPackageDirectories } from "#scripts/utils/findPackageDirectories.ts";
import { getPackageJson } from "#scripts/utils/getPackageJson.ts";

import { readdir, stat } from "node:fs/promises";
import path from "node:path";

export interface ScannedFile {
  file: string;
  time: number;
}

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
  scannedFiles: ScannedFile[],
): Promise<{ time: number; file: string }> {
  let maxTime = 0;
  let maxFile = dir;

  if (includeDirMtime) {
    try {
      const dirStat = await stat(dir);
      maxTime = dirStat.mtimeMs;
      scannedFiles.push({ file: dir, time: dirStat.mtimeMs });
    } catch {
      // Ignore if dir doesn't exist for some reason
    }
  }

  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.resolve(dir, entry.name);
    if (entry.name === "node_modules" || entry.name === "dist") continue;
    if (entry.isDirectory()) {
      const res = await getDirectoryLatestModifiedTime(
        fullPath,
        false,
        scannedFiles,
      );
      if (res.time > maxTime) {
        maxTime = res.time;
        maxFile = res.file;
      }
    } else {
      const stats = await stat(fullPath);
      scannedFiles.push({ file: fullPath, time: stats.mtimeMs });
      if (stats.mtimeMs > maxTime) {
        maxTime = stats.mtimeMs;
        maxFile = fullPath;
      }
    }
  }
  return { time: maxTime, file: maxFile };
}

export async function getLatestModifiedTime(
  sourceDir: string,
): Promise<{ time: number; file: string; scannedFiles: ScannedFile[] }> {
  const scannedFiles: ScannedFile[] = [];
  let { time: maxTime, file: maxFile } = await getDirectoryLatestModifiedTime(
    sourceDir,
    true,
    scannedFiles,
  );

  const depDirs = await getExampleWorkspaceDependencies(sourceDir);
  for (const depDir of depDirs) {
    const { time: depTime, file: depFile } =
      await getDirectoryLatestModifiedTime(depDir, false, scannedFiles);
    if (depTime > maxTime) {
      maxTime = depTime;
      maxFile = depFile;
    }
  }

  return { time: maxTime, file: maxFile, scannedFiles };
}
