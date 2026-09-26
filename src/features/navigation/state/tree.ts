import type { NavigationLink, NavigationSection } from "../../content/model.ts";

export function expandableIds(sections: readonly NavigationSection[]): Set<string> {
    const ids = new Set<string>();
    function visit(items: readonly NavigationLink[]) {
        for (const item of items) {
            if (item.children?.length) {
                ids.add(item.id);
                visit(item.children);
            }
        }
    }
    for (const section of sections) visit(section.items);
    return ids;
}

export function activeAncestors(
    sections: readonly NavigationSection[],
    pathname: string,
): string[] {
    function find(items: readonly NavigationLink[], parents: string[]): string[] | undefined {
        for (const item of items) {
            if (item.href === pathname) return parents;
            if (item.children) {
                const found = find(item.children, [...parents, item.id]);
                if (found) return found;
            }
        }
    }
    for (const section of sections) {
        const found = find(section.items, []);
        if (found) return found;
    }
    return [];
}
