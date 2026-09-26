import "server-only";
import { readFile, realpath, stat } from "node:fs/promises";
import path from "node:path";
import { ConfigurationError } from "../config/parse.ts";
import type { PageRecord, ProjectSummary, SiteDefinition } from "../model.ts";
import { resolvePage } from "../navigation.ts";

export type PageDocument = Readonly<{
    page: PageRecord;
    markdown: string;
    updatedAt: string;
    featuredProjects: readonly ProjectSummary[];
}>;

async function readMarkdown(page: PageRecord, root: string) {
    try {
        const contentRoot = await realpath(path.join(root, "content"));
        const filename = await realpath(path.resolve(contentRoot, page.content));
        const relative = path.relative(contentRoot, filename);
        // Also reject symlinks outside content/, not just ../ in JSON.
        if (
            relative.startsWith(`..${path.sep}`) ||
            relative === ".." ||
            path.isAbsolute(relative)
        ) {
            throw new Error("Content path escapes its root");
        }
        const [markdown, fileInfo] = await Promise.all([
            readFile(filename, "utf8"),
            stat(filename),
        ]);
        if (!markdown.trim()) throw new Error("Empty document");
        return { markdown, updatedAt: fileInfo.mtime.toISOString() };
    } catch {
        throw new ConfigurationError([
            `Page "${page.itemId}" (${page.path}): content/${page.content} must be a readable, non-empty Markdown file inside content/`,
        ]);
    }
}

export async function loadPageDocument(
    definition: SiteDefinition,
    pathname: string,
    root = process.cwd(),
): Promise<PageDocument | undefined> {
    const page = resolvePage(definition.pages, pathname);
    if (!page) return undefined;
    const featuredProjects = (page.featuredProjects ?? []).map((id): ProjectSummary => {
        const project = definition.pages.find((candidate) => candidate.itemId === id);
        if (!project?.description)
            throw new ConfigurationError([`Invalid featured project "${id}"`]);
        return { id, title: project.label, href: project.path, description: project.description };
    });
    const content = await readMarkdown(page, root);
    return { page, ...content, featuredProjects };
}

export async function validatePageDocuments(
    definition: SiteDefinition,
    root = process.cwd(),
): Promise<void> {
    const results = await Promise.allSettled(
        definition.pages.map((page) => readMarkdown(page, root)),
    );
    const failures = results.flatMap((result) => {
        if (result.status === "fulfilled") return [];
        return result.reason instanceof ConfigurationError
            ? result.reason.issues
            : ["Could not validate a Markdown document"];
    });
    if (failures.length) throw new ConfigurationError(failures);
}
