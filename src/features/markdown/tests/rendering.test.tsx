import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Markdown } from "../components/Markdown";

const render = (text: string) => renderToStaticMarkup(<Markdown text={text} />);

test("inserts the project list only for a standalone marker, preserving code examples", () => {
    const html = renderToStaticMarkup(
        <Markdown
            text={
                "Before.\n\n::project-list\n\nAfter.\n\n`::project-list`\n\n```text\n::project-list\n```\n\nMention ::project-list here."
            }
            projectList={<div data-project-list>Projects</div>}
        />,
    );
    assert.equal((html.match(/data-project-list/g) ?? []).length, 1);
    assert.match(
        html,
        /<p>Before\.<\/p>\s*<div data-project-list="true">Projects<\/div>\s*<p>After\.<\/p>/,
    );
    assert.ok(html.includes("<code>::project-list</code>"));
    assert.ok(html.includes("Mention ::project-list here."));
    assert.ok(!render("::project-list").includes("::project-list"));
});

test("renders the full document, including GFM tables, tasks, and linked footnotes", () => {
    const html = render(
        "First paragraph.\n\nSecond **paragraph**.\n\n## Details\n\n- [x] Done\n\n| Name | Value |\n| --- | --- |\n| A | B |\n\nNote[^one].\n\n[^one]: Footnote text.",
    );
    assert.ok(html.includes("Second <strong>paragraph</strong>"));
    assert.ok(html.includes("<h2>Details</h2>"));
    assert.ok(html.includes('class="markdown-table"'));
    assert.ok(html.includes('type="checkbox"'));
    assert.ok(html.includes("Footnote text."));
    const ref = html.match(/href="#([^"]+)"[^>]*data-footnote-backref/);
    assert.ok(ref, "footnote has a backlink");
    assert.ok(html.includes(`id="${ref[1]}"`), "backlink target is preserved");
    assert.ok(!html.includes("On this page"));
});

test("code is highlighted on the server with a language title and copy control", () => {
    const html = render('```typescript\nconst name = "Danny";\n```');
    assert.ok(html.includes('class="hljs-keyword"'));
    assert.ok(html.includes('class="hljs-string"'));
    assert.ok(html.includes("TypeScript"));
    assert.ok(html.includes('aria-label="Copy TypeScript code"'));
    assert.ok(html.includes('aria-label="TypeScript code"'));
    assert.ok(!html.includes('data-sticky="true"'));
    const long = render(
        "```text\n" + Array.from({ length: 16 }, (_, i) => `line ${i}`).join("\n") + "\n```",
    );
    assert.ok(long.includes('data-sticky="true"'));
});

test("unknown languages stay readable and diff additions and deletions retain their styling", () => {
    const html = render("```unknown\n<widget>\n```\n\n```diff\n-old\n+new\n```");
    assert.ok(html.includes("&lt;widget&gt;"));
    assert.ok(html.includes('class="diff-line deletion"'));
    assert.ok(html.includes('class="diff-line addition"'));
});

test("renders images and normal links while blocking executable Markdown URLs and raw HTML", () => {
    const html = render(
        "![A screenshot](/screenshots/example.png)\n\n[About](/me/about-me)\n\n[GitHub](https://github.com/danncd)\n\n[Bad](javascript:alert%281%29)\n\n<script>alert(1)</script>",
    );
    assert.ok(html.includes('src="/screenshots/example.png"'));
    assert.ok(html.includes('alt="A screenshot"'));
    assert.ok(html.includes('loading="lazy"'));
    assert.ok(html.includes('href="/me/about-me"'));
    assert.ok(html.includes('href="https://github.com/danncd"'));
    assert.ok(!html.includes('href="javascript:'));
    assert.ok(!html.includes("<script"));
});

test("object-property names are treated as unknown code languages", () => {
    for (const language of ["constructor", "toString", "__proto__"]) {
        const html = render("```" + language + "\nsample\n```");
        assert.ok(html.includes(`aria-label="Copy ${language.toLowerCase()} code"`));
        assert.ok(html.includes("sample"));
    }
});
