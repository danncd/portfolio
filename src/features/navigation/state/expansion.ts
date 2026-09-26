export type Expansion = Readonly<Record<string, boolean>>;
export const EXPANSION_KEY = "portfolio.navigation.expansion.v1";

export function parseExpansion(raw: string | null, allowedIds: ReadonlySet<string>): Expansion {
    try {
        const value: unknown = JSON.parse(raw ?? "null");
        if (!value || typeof value !== "object" || Array.isArray(value)) return {};
        return Object.fromEntries(
            Object.entries(value).filter(
                ([id, expanded]) => allowedIds.has(id) && typeof expanded === "boolean",
            ),
        );
    } catch {
        return {};
    }
}

/** A deep link reveals its ancestors, but a deliberate chevron click can still close them. */
export function isItemExpanded(
    id: string,
    saved: Expansion,
    ancestors: readonly string[],
    currentVisit: Expansion,
) {
    return Object.hasOwn(currentVisit, id)
        ? currentVisit[id]
        : ancestors.includes(id) || (Object.hasOwn(saved, id) && saved[id] === true);
}
