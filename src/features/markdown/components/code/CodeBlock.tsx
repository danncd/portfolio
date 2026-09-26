import type { ComponentProps } from "react";
import type { ExtraProps } from "react-markdown";
import { readCodeBlock } from "../../lib/code";
import { CopyCodeButton } from "./CopyCodeButton";
import { SyntaxCode } from "./SyntaxCode";
import { DiffCode } from "./DiffCode";

export function CodeBlock({ node }: ComponentProps<"pre"> & ExtraProps) {
    const { text, language, title, sticky } = readCodeBlock(node);
    return (
        <div className="code-block" data-sticky={sticky}>
            <div className="code-header">
                <span className="code-title">{title}</span>
                <CopyCodeButton key={text} text={text} title={title} />
            </div>
            <pre tabIndex={0} aria-label={`${title} code`}>
                {language === "diff" || language === "patch" ? (
                    <code className="diff-code">
                        <DiffCode text={text} />
                    </code>
                ) : (
                    <SyntaxCode text={text} language={language} />
                )}
            </pre>
        </div>
    );
}
