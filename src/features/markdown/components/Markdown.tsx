import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ReactNode } from "react";
import { CodeBlock } from "./code/CodeBlock";
import { MarkdownLink } from "./MarkdownLink";

export function Markdown({ text, projectList }: { text: string; projectList?: ReactNode }) {
    return (
        <div className="markdown">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                skipHtml
                components={{
                    p: ({ node, children }) => {
                        const child = node?.children[0];
                        if (
                            node?.children.length === 1 &&
                            child?.type === "text" &&
                            child.value.trim() === "::project-list"
                        ) {
                            return projectList ?? null;
                        }
                        return <p>{children}</p>;
                    },
                    pre: CodeBlock,
                    table: ({ children }) => (
                        <div
                            className="markdown-table"
                            tabIndex={0}
                            role="region"
                            aria-label="Table"
                        >
                            <table>{children}</table>
                        </div>
                    ),
                    a: ({ node, ...props }) => {
                        void node;
                        return <MarkdownLink {...props} />;
                    },
                    img: ({ src, alt, title }) => (
                        // Markdown images have author-provided URLs and unknown intrinsic dimensions.
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={src}
                            alt={alt ?? ""}
                            title={title}
                            loading="lazy"
                            decoding="async"
                        />
                    ),
                }}
            >
                {text}
            </ReactMarkdown>
        </div>
    );
}
