import type {
    NavigationConfig,
    NavigationItem,
    NavigationLink,
    NavigationSection,
    PageRecord,
} from "./model.ts";

export function collectPages(navigation: NavigationConfig): PageRecord[] {
    const pages: PageRecord[] = [];
    function visit(
        items: readonly NavigationItem[],
        sectionId: string,
        ancestorIds: readonly string[],
    ) {
        for (const item of items) {
            if (item.page)
                pages.push({
                    ...item.page,
                    itemId: item.id,
                    sectionId,
                    ancestorIds,
                    label: item.label,
                    featuredProjects: item.featuredProjects,
                });
            if (item.children) visit(item.children, sectionId, [...ancestorIds, item.id]);
        }
    }
    for (const section of navigation.sections) visit(section.items, section.id, []);
    return pages;
}

export function toNavigationSections(navigation: NavigationConfig): NavigationSection[] {
    function project(item: NavigationItem): NavigationLink {
        return {
            id: item.id,
            label: item.label,
            ...(item.icon ? { icon: item.icon } : {}),
            ...(item.page ? { href: item.page.path } : {}),
            ...(item.children ? { children: item.children.map(project) } : {}),
        };
    }
    return navigation.sections.map(({ id, label, items }) => ({
        id,
        label,
        items: items.map(project),
    }));
}

export function resolvePage(
    pages: readonly PageRecord[],
    pathname: string,
): PageRecord | undefined {
    return pages.find((page) => page.path === pathname);
}
