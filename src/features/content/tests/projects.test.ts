import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fixtureInputs } from "./fixtures.ts";
import { parseSiteDefinition } from "../config/parse.ts";
import { loadPageDocument } from "../loaders/page.server.ts";

function inputs() {
    const data = fixtureInputs();
    const home = data.navigation.sections[0].items[0];
    const parent = data.navigation.sections[1].items[0];
    const child = parent.children![0];
    home.featuredProjects = [child.id, parent.id];
    parent.page!.description = "Parent project";
    child.page!.description = "Child project";
    return { ...data, home, parent, child };
}

test("resolves featured parent and child projects in configured order", async (t) => {
    const { site, navigation } = inputs();
    const definition = parseSiteDefinition(site, navigation);
    const root = await mkdtemp(path.join(os.tmpdir(), "portfolio-projects-"));
    t.after(() => rm(root, { recursive: true, force: true }));
    await mkdir(path.join(root, "content"));
    await writeFile(path.join(root, "content/about.md"), "Before.\n\n::project-list\n\nAfter.");
    const document = await loadPageDocument(definition, site.defaultPage, root);
    assert.deepEqual(
        document?.featuredProjects.map(({ id, title, href }) => ({ id, title, href })),
        [
            { id: "qc-schedules", title: "QC Schedules", href: "/projects/coding/qc-schedules" },
            { id: "coding", title: "Coding", href: "/projects/coding" },
        ],
    );
});

test("rejects unknown, duplicate, and incomplete featured project references", () => {
    for (const ids of [["missing"], ["coding", "coding"], ["about"]]) {
        const { site, navigation, home } = inputs();
        home.featuredProjects = ids;
        assert.throws(() => parseSiteDefinition(site, navigation), /featured|Featured/);
    }
    const { site, navigation, parent } = inputs();
    delete parent.page;
    assert.throws(() => parseSiteDefinition(site, navigation), /a page and description/);
});
