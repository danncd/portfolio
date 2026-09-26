import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { displayedWidth, keyboardWidth, maximumWidth, resolveDrag } from "../state/geometry.ts";
import { readWidth, writeWidth } from "../state/preferences.ts";
import { sidebarInitScript } from "../state/preferences.ts";
import { runInNewContext } from "node:vm";
import type { SidebarSettings } from "../state/geometry.ts";

const settings: SidebarSettings = JSON.parse(
    readFileSync(new URL("../../../../config/site.json", import.meta.url), "utf8"),
).layout.sidebar;

test("drag resistance preserves gentle resizing and the collapse threshold", () => {
    assert.deepEqual(resolveDrag(170, 252, 360, settings), {
        open: true,
        width: 200,
    });
    assert.deepEqual(resolveDrag(280, 252, 360, settings), {
        open: true,
        width: 280,
    });
    assert.equal(resolveDrag(149, 252, 360, settings).open, false);
    assert.equal(resolveDrag(150, 252, 360, settings).open, true);
    assert.equal(resolveDrag(252, 252, 360, settings).open, true);
});

test("dragging from a narrow starting width uses that width as the resistance point", () => {
    assert.equal(resolveDrag(170, 190, 360, settings).width, 190);
});

test("viewport and drag maximum leave room for main content", () => {
    assert.equal(maximumWidth(settings, 640), 319.5);
    assert.equal(maximumWidth(settings, 1440), 360);
    assert.equal(resolveDrag(900, 252, 319.5, settings).width, 319.5);
});

test("mobile uses the configured default regardless of the desktop preference", () => {
    for (const savedWidth of [190, 252, 360]) {
        assert.equal(displayedWidth(settings, savedWidth, 390), settings.defaultWidth);
        assert.equal(displayedWidth(settings, savedWidth, 639), settings.defaultWidth);
        assert.equal(displayedWidth(settings, savedWidth, 1024), savedWidth);
    }
    assert.equal(displayedWidth(settings, 360, 280), 232);
    assert.equal(displayedWidth(settings, 360, 640), 319.5);
});

test("keyboard resizing supports exact steps and clamps at both limits", () => {
    assert.equal(keyboardWidth("ArrowRight", false, 252, 190, 360), 262);
    assert.equal(keyboardWidth("ArrowLeft", true, 252, 190, 360), 227);
    assert.equal(keyboardWidth("ArrowLeft", false, 190, 190, 360), 190);
    assert.equal(keyboardWidth("ArrowRight", true, 350, 190, 360), 360);
    assert.equal(keyboardWidth("Home", false, 252, 190, 360), 190);
    assert.equal(keyboardWidth("End", false, 252, 190, 360), 360);
    assert.equal(keyboardWidth("Tab", false, 252, 190, 360), undefined);
});

test("stored preferences tolerate missing, corrupt, outdated and inaccessible storage", () => {
    for (const raw of [null, "", "NaN", "Infinity", "hello", "189", "361"]) {
        assert.equal(readWidth({ getItem: () => raw }, settings), 252);
    }
    assert.equal(readWidth({ getItem: () => "310" }, settings), 310);
    assert.equal(
        readWidth(
            {
                getItem: () => {
                    throw new Error("blocked");
                },
            },
            settings,
        ),
        252,
    );
    assert.doesNotThrow(() =>
        writeWidth(
            {
                setItem: () => {
                    throw new Error("blocked");
                },
            },
            310,
        ),
    );
});

test("pre-paint bootstrap applies only valid saved widths and tolerates unavailable storage", () => {
    for (const raw of ["311", "190", "360", null, "", "oops", "Infinity", "189", "361"]) {
        const properties = new Map<string, string>();
        runInNewContext(sidebarInitScript(settings), {
            localStorage: { getItem: () => raw },
            document: {
                documentElement: {
                    style: {
                        setProperty: (key: string, value: string) => properties.set(key, value),
                    },
                },
            },
        });
        const valid =
            raw !== null && Number(raw) >= settings.minWidth && Number(raw) <= settings.maxWidth;
        assert.equal(properties.get("--sidebar-initial-width"), valid ? `${raw}px` : undefined);
    }
    assert.doesNotThrow(() =>
        runInNewContext(sidebarInitScript(settings), {
            get localStorage() {
                throw new Error("Storage blocked");
            },
        }),
    );
});

test("narrow and fractional drag widths survive saving and reloading", () => {
    for (const [raw, start] of [
        [170, 252],
        [171, 252],
        [170, 190],
        [280, 252],
    ]) {
        const result = resolveDrag(raw, start, 360, settings);
        assert.equal(result.open, true);
        let stored = null as string | null;
        writeWidth(
            {
                setItem: (_key, value) => {
                    stored = value;
                },
            },
            result.width,
        );
        assert.equal(readWidth({ getItem: () => stored }, settings), result.width);
    }
});
