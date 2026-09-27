import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import { loadSiteDefinition } from "@/features/content/loaders/site.server";
import { toNavigationSections } from "@/features/content/navigation";
import { PortfolioShell } from "./components/PortfolioShell";
import { sidebarInitScript } from "@/features/shell/state/preferences";
import { themeInitScript } from "@/features/shell/state/theme";
import "@/styles/globals.css";

export async function generateMetadata(): Promise<Metadata> {
    const { site } = await loadSiteDefinition();
    return {
        title: site.title,
        description: site.description,
        icons: site.logo ? { icon: site.logo, apple: site.logo } : undefined,
    };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
    const { site, navigation } = await loadSiteDefinition();
    const layoutStyle = {
        "--header-height": `${site.layout.headerHeight}px`,
        "--reading-width": `${site.layout.readingWidth}px`,
        "--sidebar-duration": `${site.layout.sidebar.transitionMs}ms`,
        "--sidebar-default-width": `${site.layout.sidebar.defaultWidth}px`,
    } as CSSProperties;

    return (
        // Saved preferences update the root attributes before the first paint.
        <html lang="en" suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
                <script
                    dangerouslySetInnerHTML={{ __html: sidebarInitScript(site.layout.sidebar) }}
                />
            </head>
            <body className="bg-canvas font-sans text-ink antialiased" style={layoutStyle}>
                <PortfolioShell site={site} sections={toNavigationSections(navigation)}>
                    {children}
                </PortfolioShell>
            </body>
        </html>
    );
}
