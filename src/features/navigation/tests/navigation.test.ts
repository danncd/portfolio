import assert from "node:assert/strict";
import test from "node:test";
import type { NavigationSection } from "../../content/model.ts";
import { activeAncestors, expandableIds } from "../state/tree.ts";
import { isItemExpanded, parseExpansion } from "../state/expansion.ts";

const sections: readonly NavigationSection[] = [
    {
        id: "projects",
        label: "Projects",
        items: [
            {
                id: "coding",
                label: "Coding",
                href: "/projects/coding",
                children: [
                    { id: "schedule", label: "Schedule", href: "/projects/coding/schedule" },
                    {
                        id: "tools",
                        label: "Tools",
                        children: [{ id: "cli", label: "CLI", href: "/tools/cli" }],
                    },
                ],
            },
            { id: "about", label: "About", href: "/about" },
        ],
    },
];

test("only branches have expansion preferences, including groups without pages", () => {
    assert.deepEqual([...expandableIds(sections)], ["coding", "tools"]);
});

test("parent and child routes remain distinct; visiting a parent does not expand itself", () => {
    assert.deepEqual(activeAncestors(sections, "/projects/coding"), []);
    assert.deepEqual(activeAncestors(sections, "/projects/coding/schedule"), ["coding"]);
    assert.deepEqual(activeAncestors(sections, "/projects/coding/missing"), []);
    assert.equal(
        isItemExpanded("coding", {}, activeAncestors(sections, "/projects/coding"), {}),
        false,
    );
});

test("deep links reveal every ancestor even when route paths do not mirror the tree", () => {
    assert.deepEqual(activeAncestors(sections, "/tools/cli"), ["coding", "tools"]);
    const ancestors = activeAncestors(sections, "/tools/cli");
    assert.equal(isItemExpanded("coding", { coding: false }, ancestors, {}), true);
    assert.equal(isItemExpanded("tools", { tools: false }, ancestors, {}), true);
});

test("explicit collapse wins for this visit, and a new visit reveals the active page again", () => {
    const ancestors = ["coding"];
    assert.equal(isItemExpanded("coding", { coding: true }, ancestors, { coding: false }), false);
    assert.equal(isItemExpanded("coding", { coding: false }, ancestors, {}), true);
    assert.equal(isItemExpanded("tools", { tools: true }, ancestors, {}), true);
    assert.equal(isItemExpanded("tools", { tools: false }, ancestors, {}), false);
});

test("corrupt preferences are ignored and stale IDs or non-booleans are dropped", () => {
    const ids = expandableIds(sections);
    for (const raw of [null, "{", "null", "[]", "false", '"coding"']) {
        assert.deepEqual(parseExpansion(raw, ids), {});
    }
    assert.deepEqual(
        parseExpansion('{"coding":false,"tools":true,"about":true,"removed":true}', ids),
        { coding: false, tools: true },
    );
    assert.deepEqual(parseExpansion('{"coding":"false","tools":1}', ids), {});
});

test("preferences survive label changes and tolerate object-property names as IDs", () => {
    const renamed = sections.map((section) => ({
        ...section,
        items: section.items.map((item) => ({ ...item, label: "Renamed" })),
    }));
    assert.deepEqual(parseExpansion('{"coding":true}', expandableIds(renamed)), { coding: true });
    assert.equal(isItemExpanded("constructor", {}, [], {}), false);
    assert.equal(isItemExpanded("constructor", { constructor: true }, [], {}), true);
});
