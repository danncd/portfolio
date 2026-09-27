"use client";

import { Sidebar as SidebarIcon, SidebarSimple } from "@phosphor-icons/react";
import type { Ref } from "react";

export function SidebarToggle({
    open,
    onClick,
    ref,
}: {
    open: boolean;
    onClick: () => void;
    ref: Ref<HTMLButtonElement>;
}) {
    const Icon = open ? SidebarIcon : SidebarSimple;
    return (
        <button
            ref={ref}
            id="sidebar-toggle"
            type="button"
            className="sidebar-control flex items-center justify-center text-muted"
            onClick={onClick}
            aria-label={open ? "Close sidebar" : "Open sidebar"}
            aria-expanded={open}
            aria-controls="sidebar"
        >
            <Icon size={15} weight="regular" aria-hidden="true" className="relative z-10" />
        </button>
    );
}
