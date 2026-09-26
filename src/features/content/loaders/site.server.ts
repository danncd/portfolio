import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { ConfigurationError, parseSiteDefinition } from "../config/parse.ts";
import type { SiteDefinition } from "../model.ts";

async function readJson(root: string, filename: string): Promise<unknown> {
    let source: string;
    try {
        source = await readFile(path.join(root, filename), "utf8");
    } catch {
        throw new ConfigurationError([`${filename}: Could not read the configuration file`]);
    }
    try {
        return JSON.parse(source) as unknown;
    } catch {
        throw new ConfigurationError([`${filename}: Invalid JSON syntax`]);
    }
}

export async function loadSiteDefinition(root = process.cwd()): Promise<SiteDefinition> {
    const [site, navigation] = await Promise.all([
        readJson(root, "config/site.json"),
        readJson(root, "config/navigation.json"),
    ]);
    return parseSiteDefinition(site, navigation);
}
