import type { SidebarSettings } from "./geometry.ts";

const WIDTH_KEY = "portfolio.sidebar.width.v1";
type StorageReader = Pick<Storage, "getItem">;
type StorageWriter = Pick<Storage, "setItem">;

export function readWidth(storage: StorageReader, settings: SidebarSettings) {
    try {
        const width = Number(storage.getItem(WIDTH_KEY));
        if (Number.isFinite(width) && width >= settings.minWidth && width <= settings.maxWidth)
            return width;
    } catch {
        /* Storage may be disabled. The layout still works. */
    }
    return settings.defaultWidth;
}

export function writeWidth(storage: StorageWriter, width: number) {
    try {
        storage.setItem(WIDTH_KEY, String(width));
    } catch {
        /* Keep the preference in memory when persistence is unavailable. */
    }
}

/** Runs in the document head before the sidebar can paint. Only trusted constants/numbers are serialized. */
export function sidebarInitScript(settings: SidebarSettings) {
    return `(() => {
    try {
        const width = Number(localStorage.getItem(${JSON.stringify(WIDTH_KEY)}));
        if (Number.isFinite(width) && width >= ${settings.minWidth} && width <= ${settings.maxWidth}) {
            document.documentElement.style.setProperty("--sidebar-initial-width", width + "px");
        }
    } catch {
        // Browser storage may be unavailable; the CSS default still works.
    }
})();`;
}
