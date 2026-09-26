"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "@phosphor-icons/react";

export function CopyCodeButton({ text, title }: { text: string; title: string }) {
    const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
    useEffect(() => {
        if (status === "idle") return;
        const timer = setTimeout(() => setStatus("idle"), 1800);
        return () => clearTimeout(timer);
    }, [status]);

    async function copy() {
        try {
            await navigator.clipboard.writeText(text);
            setStatus("copied");
        } catch {
            setStatus("failed");
        }
    }

    return (
        <>
            <button
                type="button"
                className="code-copy"
                aria-label={status === "copied" ? `Copied ${title} code` : `Copy ${title} code`}
                title={status === "copied" ? "Copied" : "Copy code"}
                onClick={copy}
            >
                {status === "copied" ? (
                    <Check size={15} aria-hidden="true" />
                ) : (
                    <Copy size={15} aria-hidden="true" />
                )}
            </button>
            <span className="sr-only" role="status">
                {status === "copied"
                    ? "Code copied."
                    : status === "failed"
                      ? "Could not copy. You can select and copy the code below."
                      : ""}
            </span>
        </>
    );
}
