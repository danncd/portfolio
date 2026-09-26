import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadSiteDefinition } from "@/features/content/loaders/site.server";
import { loadPageDocument } from "@/features/content/loaders/page.server";
import { resolvePage } from "@/features/content/navigation";
import { PageContent } from "@/features/content/components/PageContent";
import { getReadingStats } from "@/features/markdown/lib/readingStats";
import { ReadingStats } from "@/features/markdown/components/ReadingStats";
import { PageHeader } from "@/features/shell/layout/PageHeader";

type Props = { params: Promise<{ slug: string[] }> };

export const dynamicParams = false;

export async function generateStaticParams() {
    const { pages } = await loadSiteDefinition();
    return pages.map((page) => ({ slug: page.path.slice(1).split("/") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const { site, pages } = await loadSiteDefinition();
    const page = resolvePage(pages, `/${slug.join("/")}`);
    if (!page) notFound();
    return {
        title: `${page.title} | ${site.title}`,
        description: page.description ?? site.description,
    };
}

export default async function ContentPage({ params }: Props) {
    const { slug } = await params;
    const definition = await loadSiteDefinition();
    const document = await loadPageDocument(definition, `/${slug.join("/")}`);
    if (!document) notFound();
    const { words, minutes } = getReadingStats(document.markdown);
    const childrenPages = definition.pages.filter(
        (page) => page.ancestorIds.at(-1) === document.page.itemId,
    );
    return (
        <>
            <PageHeader
                title={document.page.title}
                metadata={
                    <ReadingStats words={words} minutes={minutes} updatedAt={document.updatedAt} />
                }
            />
            <PageContent document={document} childrenPages={childrenPages} />
        </>
    );
}
