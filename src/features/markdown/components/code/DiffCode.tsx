import { Fragment } from "react";

function lineKind(line: string) {
    if (["--- ", "+++ ", "diff ", "index "].some((prefix) => line.startsWith(prefix)))
        return "file";
    if (line.startsWith("@@")) return "hunk";
    if (line.startsWith("+")) return "addition";
    if (line.startsWith("-")) return "deletion";
    return "context";
}

export function DiffCode({ text }: { text: string }) {
    return text.split("\n").map((line, index, lines) => {
        if (index === lines.length - 1 && line === "") return null;
        return (
            <Fragment key={index}>
                <span className={`diff-line ${lineKind(line)}`}>{line}</span>
                {index < lines.length - 1 ? "\n" : null}
            </Fragment>
        );
    });
}
