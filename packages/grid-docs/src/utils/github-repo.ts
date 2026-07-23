export const GITHUB_REPO_BASE_URL = "https://github.com/jsoc-dev/grid";
export const GITHUB_REPO_MAIN_BRANCH = "main";
export const GITHUB_REPO_MAIN_BRANCH_URL = `${GITHUB_REPO_BASE_URL}/tree/${GITHUB_REPO_MAIN_BRANCH}`;
export const DOCS_GITHUB_BASE_URL = `${GITHUB_REPO_MAIN_BRANCH_URL}/docs`;
export const PACKAGE_GITHUB_BASE_URL = `${GITHUB_REPO_MAIN_BRANCH_URL}/packages`;

export function withGithubMainBranchUrl<const T extends string>(
  packageName: T,
): `${typeof GITHUB_REPO_MAIN_BRANCH_URL}/${T}` {
  return `${GITHUB_REPO_MAIN_BRANCH_URL}/${packageName}`;
}

export function withPackageGithubBaseUrl<const T extends string>(
  packageName: T,
): `${typeof PACKAGE_GITHUB_BASE_URL}/${T}` {
  return `${PACKAGE_GITHUB_BASE_URL}/${packageName}`;
}
