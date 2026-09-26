"use client";

import { useEffect, useEffectEvent } from "react";
import type { RefObject } from "react";

export function useMobileDialog(
    open: boolean,
    dialog: RefObject<HTMLDivElement | null>,
    toggle: RefObject<HTMLButtonElement | null>,
    onClose: () => void,
) {
    const close = useEffectEvent(onClose);
    useEffect(() => {
        if (!open) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const toggleElement = toggle.current;
        toggleElement?.focus();
        const onKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault();
                close();
            }
            if (event.key !== "Tab") return;
            const controls = Array.from(
                dialog.current?.querySelectorAll<HTMLElement>(
                    'a[href], button:not([disabled]), [tabindex="0"]',
                ) ?? [],
            ).filter((element) => element.getClientRects().length > 0);
            const first = controls[0];
            const last = controls.at(-1);
            if (!first || !last) {
                event.preventDefault();
                return;
            }
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };
        document.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", onKey);
            toggleElement?.focus();
        };
    }, [open, dialog, toggle]);
}
