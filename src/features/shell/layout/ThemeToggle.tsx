"use client";

import { Moon, Sun } from "@phosphor-icons/react";
import { useSyncExternalStore } from "react";
import { THEME_KEY, type Theme } from "../state/theme";

function getTheme(): Theme {
    const theme = document.documentElement.dataset.theme;
    if (theme === "light" || theme === "dark") return theme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function subscribe(update: () => void) {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
    });
    media.addEventListener("change", update);
    return () => {
        observer.disconnect();
        media.removeEventListener("change", update);
    };
}

const getServerTheme = (): Theme => "light";

export function ThemeToggle() {
    const theme = useSyncExternalStore(subscribe, getTheme, getServerTheme);
    const label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

    function toggleTheme() {
        const next = getTheme() === "dark" ? "light" : "dark";
        document.documentElement.dataset.theme = next;
        try {
            window.localStorage.setItem(THEME_KEY, next);
        } catch {
            // Keep the selected theme for this visit if persistence is unavailable.
        }
    }

    return (
        <button
            type="button"
            className="theme-toggle flex items-center justify-center text-muted"
            onClick={toggleTheme}
            aria-label={label}
            title={label}
        >
            {/* CSS selects the icon before hydration, just like the page colors. */}
            <Sun size={15} weight="regular" aria-hidden="true" className="theme-icon-sun" />
            <Moon size={15} weight="regular" aria-hidden="true" className="theme-icon-moon" />
        </button>
    );
}
