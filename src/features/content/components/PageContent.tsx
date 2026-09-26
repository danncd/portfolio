import Link from "next/link";
import { Markdown } from "@/features/markdown/components/Markdown";
import type { PageDocument } from "../loaders/page.server";
import type { PageRecord } from "../model";
import { ProjectList } from "@/features/projects/components/ProjectList";

export function PageContent({
    document,
    childrenPages,
}: {
    document: PageDocument;
    childrenPages: readonly PageRecord[];
}) {
    return (
        <main
            id="main-content"
            tabIndex={-1}
            className="mx-auto w-full max-w-(--reading-width) px-5 pt-4 pb-(--header-height) sm:px-8"
        >
            <Markdown
                text={document.markdown}
                projectList={<ProjectList projects={document.featuredProjects} />}
            />
            {childrenPages.length > 0 && (
                <section className="markdown mt-6" aria-labelledby="child-pages-title">
                    <h2 id="child-pages-title" className="text-sm font-medium">
                        In this section
                    </h2>
                    <ul className="mt-3 space-y-2">
                        {childrenPages.map((page) => (
                            <li key={page.itemId}>
                                <Link
                                    href={page.path}
                                    className="text-sm text-ink underline underline-offset-4"
                                >
                                    {page.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </main>
    );
}
