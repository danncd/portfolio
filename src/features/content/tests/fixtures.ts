import type { NavigationConfig, SiteConfig } from "../model.ts";

export function fixtureInputs() {
    const site: SiteConfig = {
        version: 1,
        name: "Portfolio",
        title: "Danny Chu Yang",
        description:
            "Projects and notes by Danny Chu Yang, a computer science student at Queens College.",
        logo: null,
        defaultPage: "/me/about-me",
        layout: {
            headerHeight: 54,
            readingWidth: 960,
            sidebar: {
                defaultWidth: 252,
                minWidth: 190,
                maxWidth: 360,
                collapseThreshold: 150,
                resistanceStart: 210,
                minContentWidth: 320,
                transitionMs: 200,
            },
        },
    };
    const navigation: NavigationConfig = {
        version: 1,
        sections: [
            {
                id: "me",
                label: "Me",
                items: [
                    {
                        id: "about",
                        label: "About Me",
                        icon: "user",
                        page: {
                            path: "/me/about-me",
                            title: "About Me",
                            content: "about.md",
                        },
                    },
                ],
            },
            {
                id: "projects",
                label: "Projects",
                items: [
                    {
                        id: "coding",
                        label: "Coding",
                        icon: "code",
                        page: {
                            path: "/projects/coding",
                            title: "Coding",
                            content: "projects/coding.md",
                        },
                        children: [
                            {
                                id: "qc-schedules",
                                label: "QC Schedules",
                                icon: "calendar",
                                page: {
                                    path: "/projects/coding/qc-schedules",
                                    title: "QC Schedules - A Website",
                                    content: "projects/qc-schedules.md",
                                },
                            },
                        ],
                    },
                ],
            },
        ],
    };
    return { site, navigation };
}
