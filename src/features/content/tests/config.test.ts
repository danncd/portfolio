import assert from "node:assert/strict";
import test from "node:test";
import { parseSiteDefinition } from "../config/parse.ts";
import { fixtureInputs } from "./fixtures.ts";
import { resolvePage, toNavigationSections } from "../navigation.ts";

function fixture() {
    const { site, navigation } = fixtureInputs();
    return parseSiteDefinition(site, navigation);
}

test("parent and child resolve independently and preserve configured order", () => {
    const definition = fixture();
    assert.deepEqual(
        definition.pages.map((page) => page.itemId),
        ["about", "coding", "qc-schedules"],
    );
    assert.equal(resolvePage(definition.pages, "/projects/coding")?.content, "projects/coding.md");
    const child = resolvePage(definition.pages, "/projects/coding/qc-schedules");
    assert.equal(child?.content, "projects/qc-schedules.md");
    assert.deepEqual(child?.ancestorIds, ["coding"]);
    assert.equal(resolvePage(definition.pages, "/does-not-exist"), undefined);
});

test("client navigation retains parent links and children but omits content metadata", () => {
    const navigation = toNavigationSections(fixture().navigation);
    const parent = navigation[1].items[0];
    assert.equal(parent.href, "/projects/coding");
    assert.equal(parent.icon, "code");
    assert.equal(parent.children?.[0].icon, "calendar");
    assert.equal(parent.children?.[0].href, "/projects/coding/qc-schedules");
    assert.equal(JSON.stringify(navigation).includes('"content"'), false);
    assert.equal(JSON.stringify(navigation).includes('"title"'), false);
});

test("item icons are optional and unknown names identify the config field", () => {
    const { site, navigation } = fixture();
    const item = navigation.sections[0].items[0];
    delete item.icon;
    assert.equal(
        toNavigationSections(parseSiteDefinition(site, navigation).navigation)[0].items[0].icon,
        undefined,
    );
    const invalid = structuredClone(navigation);
    Object.assign(invalid.sections[0].items[0], { icon: "unknown-icon" });
    assert.throws(() => parseSiteDefinition(site, invalid), /sections\.0\.items\.0\.icon/);
});

test("renaming a label does not change stable IDs or URLs", () => {
    const { site, navigation } = fixture();
    navigation.sections[1].items[0].label = "Software";
    const definition = parseSiteDefinition(site, navigation);
    assert.equal(resolvePage(definition.pages, "/projects/coding")?.itemId, "coding");
});

test("group-only entries preserve children without inventing a page", () => {
    const { site, navigation } = fixture();
    delete navigation.sections[1].items[0].page;
    const definition = parseSiteDefinition(site, navigation);
    assert.equal(resolvePage(definition.pages, "/projects/coding"), undefined);
    assert.equal(definition.pages.length, 2);
    assert.equal(toNavigationSections(definition.navigation)[1].items[0].href, undefined);
});

test("IDs must be unique across sections and nested items", () => {
    const { site, navigation } = fixture();
    navigation.sections[1].items[0].children![0].id = "me";
    assert.throws(() => parseSiteDefinition(site, navigation), /Duplicate ID "me"/);
});

test("duplicate page URLs are rejected even when IDs differ", () => {
    const { site, navigation } = fixture();
    navigation.sections[1].items[0].page!.path = "/me/about-me";
    assert.throws(
        () => parseSiteDefinition(site, navigation),
        /Duplicate page path "\/me\/about-me"/,
    );
});

test("default page must exist", () => {
    const { site, navigation } = fixture();
    site.defaultPage = "/missing";
    assert.throws(() => parseSiteDefinition(site, navigation), /defaultPage "\/missing"/);
});

test("empty items and accidental fields produce actionable locations", () => {
    const { site, navigation } = fixture();
    navigation.sections[1].items[0] = { id: "empty", label: "Empty" };
    assert.throws(
        () => parseSiteDefinition(site, navigation),
        /sections\.1\.items\.0.*needs a page/,
    );
    assert.throws(
        () => parseSiteDefinition({ ...site, defaultPgae: "/me/about-me" }, fixture().navigation),
        /defaultPgae/,
    );
});

test("ambiguous URLs and content traversal are rejected", () => {
    for (const invalidPath of [
        "/",
        "/Projects",
        "/about/",
        "/a//b",
        "/a?b",
        "https://example.com",
    ]) {
        const { site, navigation } = fixture();
        navigation.sections[0].items[0].page!.path = invalidPath;
        assert.throws(() => parseSiteDefinition(site, navigation), /absolute lowercase route/);
    }
    for (const invalidContent of [
        "../private.md",
        "/about.md",
        "projects/../../about.md",
        "about.mdx",
    ]) {
        const { site, navigation } = fixture();
        navigation.sections[0].items[0].page!.content = invalidContent;
        assert.throws(() => parseSiteDefinition(site, navigation), /relative lowercase .md path/);
    }
});

test("sidebar geometry cannot contradict its resize limits", () => {
    const { site, navigation } = fixture();
    site.layout.sidebar.defaultWidth = 500;
    site.layout.sidebar.collapseThreshold = 300;
    assert.throws(() => parseSiteDefinition(site, navigation), /defaultWidth/);
    assert.throws(() => parseSiteDefinition(site, navigation), /collapseThreshold/);
});
