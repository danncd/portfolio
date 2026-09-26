import type { Element } from "hast";

const languageNames: Record<string, string> = {
    ts: "TypeScript",
    typescript: "TypeScript",
    tsx: "TSX",
    js: "JavaScript",
    javascript: "JavaScript",
    jsx: "JSX",
    c: "C",
    cpp: "C++",
    java: "Java",
    swift: "Swift",
    xml: "XML",
    json: "JSON",
    jsonc: "JSONC",
    html: "HTML",
    css: "CSS",
    sh: "Shell",
    shell: "Shell",
    bash: "Bash",
    zsh: "Zsh",
    py: "Python",
    python: "Python",
    go: "Go",
    rust: "Rust",
    sql: "SQL",
    yaml: "YAML",
    yml: "YAML",
    md: "Markdown",
    markdown: "Markdown",
    diff: "Diff",
    patch: "Diff",
    text: "Plain text",
    plaintext: "Plain text",
    txt: "Plain text",
};

export function readCodeBlock(node?: Element) {
    const code = node?.children.find(
        (child) => child.type === "element" && child.tagName === "code",
    );
    const classes =
        code?.type === "element" ? String(code.properties.className ?? "").split(/[ ,]+/) : [];
    const language =
        classes
            .find((value) => value.startsWith("language-"))
            ?.slice(9)
            .toLowerCase() ?? "";
    const text =
        code?.type === "element"
            ? code.children.map((child) => (child.type === "text" ? child.value : "")).join("")
            : "";
    const lineCount = text === "" ? 0 : text.split("\n").length - (text.endsWith("\n") ? 1 : 0);
    return {
        text,
        language,
        title: Object.hasOwn(languageNames, language)
            ? languageNames[language]
            : language || "Plain text",
        sticky: lineCount > 15,
    };
}
