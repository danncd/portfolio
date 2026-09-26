"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import type { NavigationSection } from "../../content/model";
import { activeAncestors, expandableIds } from "../state/tree";
import { isItemExpanded, parseExpansion } from "../state/expansion";
import type { Expansion } from "../state/expansion";
import {
    readExpansionSnapshot,
    saveExpansion,
    serverExpansionSnapshot,
    subscribeExpansion,
} from "../state/expansionStore";

/** Used by a tree keyed to the current route, so a new visit reveals the selected page. */
export function useNavigationExpansion(sections: readonly NavigationSection[], pathname: string) {
    const raw = useSyncExternalStore(
        subscribeExpansion,
        readExpansionSnapshot,
        serverExpansionSnapshot,
    );
    const ids = useMemo(() => expandableIds(sections), [sections]);
    const saved = useMemo(() => parseExpansion(raw, ids), [raw, ids]);
    const ancestors = useMemo(() => activeAncestors(sections, pathname), [sections, pathname]);
    const [currentVisit, setCurrentVisit] = useState<Expansion>({});

    const isExpanded = (id: string) => isItemExpanded(id, saved, ancestors, currentVisit);
    function toggle(id: string) {
        if (!ids.has(id)) return;
        const expanded = !isExpanded(id);
        setCurrentVisit((previous) => ({ ...previous, [id]: expanded }));
        saveExpansion({ ...saved, [id]: expanded });
    }
    return { isExpanded, toggle };
}
