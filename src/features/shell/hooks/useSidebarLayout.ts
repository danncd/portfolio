"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import {
    displayedWidth,
    keyboardWidth,
    maximumWidth,
    MOBILE_BREAKPOINT,
    resolveDrag,
} from "../state/geometry";
import type { SidebarSettings } from "../state/geometry";
import { readWidth, writeWidth } from "../state/preferences";

function subscribeViewport(update: () => void) {
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
}
const getViewport = () => window.innerWidth;
const getServerViewport = () => 1024;

export function useSidebarLayout(settings: SidebarSettings) {
    const viewport = useSyncExternalStore(subscribeViewport, getViewport, getServerViewport);
    const mobile = viewport < MOBILE_BREAKPOINT;
    const maximum = maximumWidth(settings, viewport);
    const [width, setWidth] = useState(settings.defaultWidth);
    const [ready, setReady] = useState(false);
    const savedWidth = useRef(settings.defaultWidth);
    const [desktopOpen, setDesktopOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [dragging, setDragging] = useState(false);
    const cleanupDrag = useRef<(() => void) | null>(null);

    useEffect(() => {
        // Adopt the preference already applied by the pre-paint script; CSS owns the initial geometry.
        const frame = requestAnimationFrame(() => {
            try {
                const stored = readWidth(window.localStorage, settings);
                savedWidth.current = stored;
                setWidth(stored);
            } catch {
                /* Accessing localStorage itself can also throw. */
            }
            setReady(true);
        });
        return () => {
            cancelAnimationFrame(frame);
            cleanupDrag.current?.();
        };
    }, [settings]);

    useEffect(() => {
        cleanupDrag.current?.();
    }, [viewport]);

    function remember(next: number) {
        savedWidth.current = next;
        try {
            writeWidth(window.localStorage, next);
        } catch {
            /* Use the in-memory preference. */
        }
    }

    function toggle() {
        if (mobile) setMobileOpen((open) => !open);
        else {
            if (!desktopOpen) setWidth(savedWidth.current);
            setDesktopOpen((open) => !open);
        }
    }

    function startResize(event: PointerEvent<HTMLDivElement>) {
        if (mobile || event.button !== 0 || !event.isPrimary) return;
        event.preventDefault();
        cleanupDrag.current?.();
        const startX = event.clientX;
        const startWidth = Math.min(width, maximum);
        const pointerId = event.pointerId;
        let latestX = startX;
        let frame: number | undefined;
        let open = true;
        let preferred = savedWidth.current;
        setDragging(true);

        const apply = () => {
            frame = undefined;
            const next = resolveDrag(startWidth + latestX - startX, startWidth, maximum, settings);
            open = next.open;
            setDesktopOpen(open);
            if (open) {
                setWidth(next.width);
                preferred = next.width;
            }
        };
        const move = (pointer: globalThis.PointerEvent) => {
            if (pointer.pointerId !== pointerId) return;
            latestX = pointer.clientX;
            if (frame === undefined) frame = requestAnimationFrame(apply);
        };
        const finish = () => {
            if (frame !== undefined) {
                cancelAnimationFrame(frame);
                apply();
            }
            remember(preferred);
            setDragging(false);
            window.removeEventListener("pointermove", move);
            window.removeEventListener("pointerup", up);
            window.removeEventListener("pointercancel", up);
            window.removeEventListener("blur", finish);
            cleanupDrag.current = null;
            // The separator disappears on collapse; leave keyboard focus on the reopen button.
            if (!open) document.getElementById("sidebar-toggle")?.focus();
        };
        const up = (pointer: globalThis.PointerEvent) => {
            if (pointer.pointerId === pointerId) finish();
        };
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up);
        window.addEventListener("pointercancel", up);
        window.addEventListener("blur", finish);
        cleanupDrag.current = finish;
    }

    function resizeWithKeyboard(event: KeyboardEvent<HTMLDivElement>) {
        const next = keyboardWidth(
            event.key,
            event.shiftKey,
            Math.min(width, maximum),
            settings.minWidth,
            maximum,
        );
        if (next === undefined) return;
        event.preventDefault();
        setWidth(next);
        remember(next);
    }

    return {
        width: displayedWidth(settings, width, viewport),
        maximum,
        mobile,
        desktopOpen,
        mobileOpen,
        dragging,
        ready,
        open: mobile ? mobileOpen : desktopOpen,
        toggle,
        startResize,
        resizeWithKeyboard,
        closeMobile: () => setMobileOpen(false),
    };
}
