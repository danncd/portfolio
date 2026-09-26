import type { Root, RootContent } from "mdast";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";

const parser = unified().use(remarkParse).use(remarkGfm);
const segmenter = new Intl.Segmenter("en", { granularity: "word" });

function plainText(node: Root | RootContent): string {
    if (
        node.type === "paragraph" &&
        node.children.length === 1 &&
        node.children[0].type === "text" &&
        node.children[0].value.trim() === "::project-list"
    ) {
        return "";
    }
    if (node.type === "text" || node.type === "inlineCode") return node.value;
    if (node.type === "break") return " ";
    if (!("children" in node)) return "";

    const separator = [
        "paragraph",
        "heading",
        "tableCell",
        "strong",
        "emphasis",
        "delete",
        "link",
        "linkReference",
    ].includes(node.type)
        ? ""
        : " ";

    return node.children.map(plainText).join(separator);
}

export function getReadingStats(markdown: string) {
    const text = plainText(parser.parse(markdown));
    const words = Array.from(segmenter.segment(text)).filter((part) => part.isWordLike).length;

    return { words, minutes: Math.max(1, Math.ceil(words / 200)) };
}
