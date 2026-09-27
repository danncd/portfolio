"use client";

import { useRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { SidebarSettings } from "../state/geometry";
import { Sidebar } from "../sidebar/Sidebar";
import { SidebarResizeHandle } from "../sidebar/SidebarResizeHandle";
import { ThemeToggle } from "../sidebar/ThemeToggle";
import { SidebarToggle } from "../sidebar/SidebarToggle";
import { useSidebarLayout } from "../hooks/useSidebarLayout";
import { useMobileDialog } from "../hooks/useMobileDialog";

export function SiteShell({
    name,
    logo,
    settings,
    navigation,
    children,
}: {
    name: string;
    logo: string | null;
    settings: SidebarSettings;
    navigation: (closeMobile: () => void) => ReactNode;
    children: ReactNode;
}) {
    const layout = useSidebarLayout(settings);
    const dialog = useRef<HTMLDivElement>(null);
    const toggle = useRef<HTMLButtonElement>(null);
    const modal = layout.mobile && layout.mobileOpen;
    useMobileDialog(modal, dialog, toggle, layout.closeMobile);
    // CSS can fit the saved width to the real viewport before React knows its size.
    const initialWidth = `min(var(--sidebar-initial-width, ${settings.defaultWidth}px), ${settings.maxWidth}px, max(${settings.minWidth}px, calc(100vw - ${settings.minContentWidth + 0.5}px)))`;

    return (
        <div
            className="site-shell min-h-dvh"
            data-desktop-open={layout.desktopOpen}
            data-mobile-open={layout.mobileOpen}
            data-dragging={layout.dragging}
            style={
                {
                    "--desktop-panel-width": layout.ready ? `${layout.width}px` : initialWidth,
                } as CSSProperties
            }
        >
            <a
                href="#main-content"
                inert={modal}
                className="skip-link fixed top-2 left-16 z-50 rounded-control bg-canvas px-4 py-2 text-sm text-link"
            >
                Skip to content
            </a>
            {modal && (
                <div
                    className="fixed inset-0 z-30 bg-black/20"
                    aria-hidden="true"
                    onClick={layout.closeMobile}
                />
            )}
            <div
                ref={dialog}
                role={modal ? "dialog" : undefined}
                aria-modal={modal || undefined}
                aria-label={modal ? "Site navigation" : undefined}
            >
                <Sidebar name={name} logo={logo} open={layout.open}>
                    {navigation(layout.closeMobile)}
                </Sidebar>
                <div className="sidebar-controls">
                    <SidebarToggle ref={toggle} open={layout.open} onClick={layout.toggle} />
                    <ThemeToggle />
                </div>
                {layout.desktopOpen && !layout.mobile && (
                    <SidebarResizeHandle
                        width={layout.width}
                        minimum={settings.minWidth}
                        maximum={layout.maximum}
                        onPointerDown={layout.startResize}
                        onKeyDown={layout.resizeWithKeyboard}
                    />
                )}
            </div>
            <div className="main-column" inert={modal}>
                {children}
            </div>
        </div>
    );
}
