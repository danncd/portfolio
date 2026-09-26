import type { SiteConfig } from "../../content/model.ts";

export type SidebarSettings = SiteConfig["layout"]["sidebar"];
export const MOBILE_BREAKPOINT = 640;

export function maximumWidth(settings: SidebarSettings, viewport: number) {
    return Math.min(
        settings.maxWidth,
        Math.max(settings.minWidth, viewport - settings.minContentWidth - 0.5),
    );
}

/** Mobile ignores the desktop preference, while leaving it intact for larger screens. */
export function displayedWidth(settings: SidebarSettings, desktopWidth: number, viewport: number) {
    return viewport < MOBILE_BREAKPOINT
        ? Math.min(settings.defaultWidth, viewport - 48)
        : Math.min(desktopWidth, maximumWidth(settings, viewport));
}

/** Below the resistance point, the panel moves one pixel per four pointer pixels. */
export function resolveDrag(
    rawWidth: number,
    startWidth: number,
    maximum: number,
    settings: SidebarSettings,
) {
    const resistance = Math.min(settings.resistanceStart, startWidth);
    return {
        open: rawWidth >= settings.collapseThreshold,
        width: Math.min(
            maximum,
            rawWidth < resistance ? resistance - (resistance - rawWidth) * 0.25 : rawWidth,
        ),
        remember: rawWidth >= Math.max(settings.minWidth, resistance),
    };
}

export function keyboardWidth(
    key: string,
    shift: boolean,
    width: number,
    minimum: number,
    maximum: number,
) {
    if (key === "Home") return minimum;
    if (key === "End") return maximum;
    if (key !== "ArrowLeft" && key !== "ArrowRight") return undefined;
    return Math.max(
        minimum,
        Math.min(maximum, width + (key === "ArrowRight" ? 1 : -1) * (shift ? 25 : 10)),
    );
}
