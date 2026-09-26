import type { z } from "zod";
import type { IconName } from "./config/iconNames.ts";
import type {
    navigationItemSchema,
    navigationSchema,
    pageSchema,
    siteSchema,
} from "./config/schema.ts";

export type SiteConfig = z.infer<typeof siteSchema>;
export type NavigationConfig = z.infer<typeof navigationSchema>;
export type NavigationItem = z.infer<typeof navigationItemSchema>;
export type Page = z.infer<typeof pageSchema>;

export type PageRecord = Readonly<
    Page & {
        itemId: string;
        sectionId: string;
        ancestorIds: readonly string[];
        label: string;
        featuredProjects?: readonly string[];
    }
>;

export type ProjectSummary = Readonly<{
    id: string;
    title: string;
    href: string;
    description: string;
}>;

export type SiteDefinition = Readonly<{
    site: SiteConfig;
    navigation: NavigationConfig;
    pages: readonly PageRecord[];
}>;

export type NavigationLink = Readonly<{
    id: string;
    label: string;
    icon?: IconName;
    href?: string;
    children?: readonly NavigationLink[];
}>;

export type NavigationSection = Readonly<{
    id: string;
    label: string;
    items: readonly NavigationLink[];
}>;
