import { z } from "zod";
import { iconNames } from "./iconNames.ts";

const segment = "[a-z0-9]+(?:-[a-z0-9]+)*";
const id = z.string().regex(new RegExp(`^${segment}$`), "Use a lowercase kebab-case ID");
const text = z.string().trim().min(1, "Must not be empty");
const pixels = z.number().int().positive();

const pagePath = z
    .string()
    .regex(
        new RegExp(`^/${segment}(?:/${segment})*$`),
        "Use an absolute lowercase route without a trailing slash (for example /projects/coding)",
    );
const markdownPath = z
    .string()
    .regex(
        new RegExp(`^(?:${segment}/)*${segment}\\.md$`),
        "Use a relative lowercase .md path inside content/ (for example projects/coding.md)",
    );

export const pageSchema = z.strictObject({
    path: pagePath,
    title: text,
    description: text.optional(),
    content: markdownPath,
});

const navigationItemFields = z.strictObject({
    id,
    label: text,
    icon: z.enum(iconNames).optional(),
    page: pageSchema.optional(),
    featuredProjects: z
        .array(id)
        .refine((ids) => new Set(ids).size === ids.length, "Featured project IDs must be unique")
        .optional(),
});

type NavigationItemData = z.infer<typeof navigationItemFields> & {
    children?: NavigationItemData[];
};

export const navigationItemSchema: z.ZodType<NavigationItemData> = navigationItemFields
    .extend({
        children: z.lazy(() => z.array(navigationItemSchema).min(1)).optional(),
    })
    .refine((item) => item.page !== undefined || item.children !== undefined, {
        message: "An item needs a page, children, or both",
    });

export const navigationSchema = z.strictObject({
    version: z.literal(1),
    sections: z
        .array(
            z.strictObject({
                id,
                label: text,
                items: z.array(navigationItemSchema).min(1),
            }),
        )
        .min(1),
});

const sidebarSchema = z
    .strictObject({
        defaultWidth: pixels,
        minWidth: pixels,
        maxWidth: pixels,
        collapseThreshold: pixels,
        resistanceStart: pixels,
        minContentWidth: pixels,
        transitionMs: z.number().int().nonnegative(),
    })
    .superRefine((sidebar, ctx) => {
        if (sidebar.minWidth > sidebar.defaultWidth || sidebar.defaultWidth > sidebar.maxWidth) {
            ctx.addIssue({
                code: "custom",
                path: ["defaultWidth"],
                message: "Must be between minWidth and maxWidth",
            });
        }
        if (sidebar.collapseThreshold >= sidebar.minWidth) {
            ctx.addIssue({
                code: "custom",
                path: ["collapseThreshold"],
                message: "Must be below minWidth",
            });
        }
        if (
            sidebar.resistanceStart < sidebar.minWidth ||
            sidebar.resistanceStart > sidebar.maxWidth
        ) {
            ctx.addIssue({
                code: "custom",
                path: ["resistanceStart"],
                message: "Must be between minWidth and maxWidth",
            });
        }
    });

export const siteSchema = z.strictObject({
    version: z.literal(1),
    name: text,
    title: text,
    description: text,
    // A local monochrome logo asset, or null to show only the sidebar title.
    logo: z
        .string()
        .regex(/^\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]+\.(?:svg|png|webp)$/)
        .nullable(),
    defaultPage: pagePath,
    layout: z.strictObject({
        headerHeight: pixels,
        readingWidth: pixels,
        sidebar: sidebarSchema,
    }),
});
