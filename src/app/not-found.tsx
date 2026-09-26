import Link from "next/link";
import { loadSiteDefinition } from "@/features/content/loaders/site.server";
import { PageHeader } from "@/features/shell/layout/PageHeader";

export default async function NotFound() {
    const { site } = await loadSiteDefinition();
    return (
        <>
            <PageHeader title="Page not found" />
            <main
                id="main-content"
                tabIndex={-1}
                className="mx-auto w-full max-w-(--reading-width) px-5 py-4 sm:px-8"
            >
                <p className="text-sm leading-7">This page doesn’t exist.</p>
                <Link
                    href={site.defaultPage}
                    className="mt-3 inline-block text-sm text-link underline underline-offset-4"
                >
                    Return to the start page
                </Link>
            </main>
        </>
    );
}
