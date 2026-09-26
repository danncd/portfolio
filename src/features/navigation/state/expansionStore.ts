"use client";

import { EXPANSION_KEY } from "./expansion";
import type { Expansion } from "./expansion";

const CHANGE_EVENT = "portfolio:navigation-expansion";
let memory: string | null = null;
let useMemory = false;

export function readExpansionSnapshot(): string | null {
    if (useMemory) return memory;
    try {
        return window.localStorage.getItem(EXPANSION_KEY);
    } catch {
        return memory;
    }
}

export const serverExpansionSnapshot = () => null;

export function subscribeExpansion(listener: () => void) {
    const onStorage = (event: StorageEvent) => {
        if (event.key === EXPANSION_KEY || event.key === null) listener();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener(CHANGE_EVENT, listener);
    return () => {
        window.removeEventListener("storage", onStorage);
        window.removeEventListener(CHANGE_EVENT, listener);
    };
}

export function saveExpansion(expanded: Expansion) {
    memory = JSON.stringify(expanded);
    try {
        window.localStorage.setItem(EXPANSION_KEY, memory);
        useMemory = false;
    } catch {
        // The in-memory snapshot keeps navigation usable when storage is blocked.
        useMemory = true;
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
}
