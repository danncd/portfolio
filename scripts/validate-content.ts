import { loadSiteDefinition } from "../src/features/content/loaders/site.server.ts";
import { validatePageDocuments } from "../src/features/content/loaders/page.server.ts";

try {
    const definition = await loadSiteDefinition();
    await validatePageDocuments(definition);
    console.log(
        `Validated ${definition.navigation.sections.length} sections and ${definition.pages.length} pages.`,
    );
    for (const page of definition.pages) console.log(`  ${page.path} → content/${page.content}`);
} catch (error) {
    console.error(error instanceof Error ? error.message : "Could not validate portfolio content");
    process.exitCode = 1;
}
