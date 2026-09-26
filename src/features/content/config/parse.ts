import { z } from "zod";
import type { NavigationItem, SiteDefinition } from "../model.ts";
import { collectPages } from "../navigation.ts";
import { navigationSchema, siteSchema } from "./schema.ts";

export class ConfigurationError extends Error {
    readonly issues: readonly string[];

    constructor(issues: readonly string[]) {
        super(
            `Invalid portfolio configuration:\n${issues.map((issue) => `- ${issue}`).join("\n")}`,
        );
        this.name = "ConfigurationError";
        this.issues = [...issues];
    }
}

function formatIssues(file: string, error: z.ZodError): string[] {
    return error.issues.map(
        (issue) => `${file}: ${issue.path.join(".") || "root"}: ${issue.message}`,
    );
}

export function parseSiteDefinition(siteInput: unknown, navigationInput: unknown): SiteDefinition {
    const site = siteSchema.safeParse(siteInput);
    const navigation = navigationSchema.safeParse(navigationInput);
    if (!site.success || !navigation.success) {
        throw new ConfigurationError([
            ...(!site.success ? formatIssues("config/site.json", site.error) : []),
            ...(!navigation.success
                ? formatIssues("config/navigation.json", navigation.error)
                : []),
        ]);
    }

    const issues: string[] = [];
    const ids = new Set<string>();
    function registerId(id: string) {
        if (ids.has(id)) issues.push(`config/navigation.json: Duplicate ID "${id}"`);
        ids.add(id);
    }
    function visit(items: readonly NavigationItem[]) {
        for (const item of items) {
            registerId(item.id);
            if (item.featuredProjects && !item.page) {
                issues.push(
                    `config/navigation.json: Item "${item.id}" needs a page to use featuredProjects`,
                );
            }
            if (item.children) visit(item.children);
        }
    }
    for (const section of navigation.data.sections) {
        registerId(section.id);
        visit(section.items);
    }

    const pages = collectPages(navigation.data);
    const paths = new Set<string>();
    const pagesById = new Map(pages.map((page) => [page.itemId, page]));
    for (const page of pages) {
        for (const id of page.featuredProjects ?? []) {
            const project = pagesById.get(id);
            if (!project?.description) {
                issues.push(
                    `config/navigation.json: Item "${page.itemId}": featured project "${id}" must identify an item with a page and description`,
                );
            }
        }
        if (paths.has(page.path))
            issues.push(`config/navigation.json: Duplicate page path "${page.path}"`);
        paths.add(page.path);
    }
    if (!paths.has(site.data.defaultPage)) {
        issues.push(
            `config/site.json: defaultPage "${site.data.defaultPage}" does not identify a configured page`,
        );
    }
    if (issues.length) throw new ConfigurationError(issues);
    return { site: site.data, navigation: navigation.data, pages };
}
