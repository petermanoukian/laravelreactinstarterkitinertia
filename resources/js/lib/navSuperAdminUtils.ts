//navSuperAdminUtils.ts
export const isItemActive = (href: string | undefined, currentPath: string, currentQuery: URLSearchParams): boolean => {
  if (!href) return false;

  try {
    const url = new URL(href, window.location.origin);
    const targetPath = url.pathname;
    const targetParams = url.searchParams;

    // Check path match
    const pathMatches = currentPath === targetPath;

    // Check query matches (e.g. role=superadmin)
    let queryMatches = true;
    for (const [key, value] of targetParams.entries()) {
      if (currentQuery.get(key) !== value) {
        queryMatches = false;
        break;
      }
    }

    return pathMatches && queryMatches;
  } catch (e) {
    return false;
  }
};
