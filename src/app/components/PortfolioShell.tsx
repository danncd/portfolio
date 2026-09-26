"use client";

import type { ReactNode } from "react";
import type { NavigationSection, SiteConfig } from "@/features/content/model";
import { SidebarNav } from "@/features/navigation/components/SidebarNav";
import { SiteShell } from "@/features/shell/layout/SiteShell";

export function PortfolioShell({
    site,
    sections,
    children,
}: {
    site: SiteConfig;
    sections: readonly NavigationSection[];
    children: ReactNode;
}) {
    return (
        <SiteShell
            name={site.name}
            logo={site.logo}
            settings={site.layout.sidebar}
            navigation={(closeMobile) => (
                <SidebarNav sections={sections} onNavigate={closeMobile} />
            )}
        >
            {children}
        </SiteShell>
    );
}
