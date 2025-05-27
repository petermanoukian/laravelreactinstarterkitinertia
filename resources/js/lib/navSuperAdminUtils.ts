//navSuperAdminUtils.ts

export const isItemActive = (
  href: string | undefined,
  currentPath: string,
  currentQuery: URLSearchParams
): boolean => {
  if (!href) return false;

  try {
    const url = new URL(href, window.location.origin);
    const targetPath = url.pathname;
    const targetParams = url.searchParams;

    if (currentPath !== targetPath) return false;

    // Only check for 'role' param and treat 'role=all' as a wildcard
    const targetRole = targetParams.get('role');
    const currentRole = currentQuery.get('role');



    if (targetRole !== null) {
      return targetRole === currentRole;
    }

    // If no role in target, accept any
    return true;
  } catch (e) {
    return false;
  }
};

