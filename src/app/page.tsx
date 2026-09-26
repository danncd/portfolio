import { redirect } from "next/navigation";
import { loadSiteDefinition } from "@/features/content/loaders/site.server";

export default async function Home() {
    const { site } = await loadSiteDefinition();
    redirect(site.defaultPage);
}
