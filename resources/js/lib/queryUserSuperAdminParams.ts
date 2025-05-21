//queryUserSuperAdminParams.ts
/**
 * Builds query params with 'role' first, followed by the rest.
 */
export function buildQueryParams(filters: Record<string, any>): Record<string, any> {
    const { role, ...rest } = filters;

    const ordered: Record<string, any> = {};

    if (role !== undefined) {
        ordered.role = role;
    }

    // Preserve the rest of the keys in their order
    for (const key of Object.keys(rest)) {
        const value = rest[key];
        if (value !== '' && value !== null && value !== undefined) {
            ordered[key] = value;
        }
    }

    return ordered;
}
