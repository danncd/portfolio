import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test, { type TestContext } from "node:test";
import { fixtureInputs } from "./fixtures.ts";
import { loadSiteDefinition } from "../loaders/site.server.ts";
import { loadPageDocument, validatePageDocuments } from "../loaders/page.server.ts";

async function fixture(t: TestContext) {
    const root = await mkdtemp(path.join(os.tmpdir(), "portfolio-content-test-"));
    t.after(() => rm(root, { recursive: true, force: true }));
    const { site, navigation } = fixtureInputs();
    await mkdir(path.join(root, "config"));
    await mkdir(path.join(root, "content/projects"), { recursive: true });
    await writeFile(path.join(root, "config/site.json"), JSON.stringify(site));
    await writeFile(path.join(root, "config/navigation.json"), JSON.stringify(navigation));
    await writeFile(path.join(root, "content/about.md"), "About fixture.");
    await writeFile(path.join(root, "content/projects/coding.md"), "Parent fixture.");
    await writeFile(path.join(root, "content/projects/qc-schedules.md"), "Child fixture.");
    return { root, definition: await loadSiteDefinition(root) };
}

test("loads parent and child documents through the server boundary", async (t) => {
    const { root, definition } = await fixture(t);
    const parent = await loadPageDocument(definition, "/projects/coding", root);
    const child = await loadPageDocument(definition, "/projects/coding/qc-schedules", root);
    assert.equal(parent?.markdown, "Parent fixture.");
    assert.equal(child?.markdown, "Child fixture.");
    assert.equal(child!.page.title, "QC Schedules - A Website");
    assert.equal(await loadPageDocument(definition, "/unknown", root), undefined);
    await validatePageDocuments(definition, root);
});

test("missing and empty documents identify their page and filename", async (t) => {
    const { root, definition } = await fixture(t);
    await rm(path.join(root, "content/projects/coding.md"));
    await writeFile(path.join(root, "content/projects/qc-schedules.md"), " \n");
    await assert.rejects(validatePageDocuments(definition, root), (error: Error) => {
        assert.match(error.message, /Page "coding".*projects\/coding.md/);
        assert.match(error.message, /Page "qc-schedules".*projects\/qc-schedules.md/);
        return true;
    });
});

test("a symlink cannot load Markdown outside the content directory", async (t) => {
    const { root, definition } = await fixture(t);
    const filename = path.join(root, "content/about.md");
    await rm(filename);
    await writeFile(path.join(root, "outside.md"), "Not a public content file");
    await symlink(path.join(root, "outside.md"), filename);
    await assert.rejects(loadPageDocument(definition, "/me/about-me", root), /inside content\//);
});

test("JSON syntax errors identify the broken configuration file", async (t) => {
    const { root } = await fixture(t);
    const filename = path.join(root, "config/navigation.json");
    const source = await readFile(filename, "utf8");
    await writeFile(filename, source.slice(0, -5));
    await assert.rejects(loadSiteDefinition(root), /config\/navigation.json: Invalid JSON syntax/);
});
