import Link from "next/link";
import { GithubLogo, LinkedinLogo } from "@phosphor-icons/react/dist/ssr";
import type { ComponentPropsWithoutRef } from "react";

export function MarkdownLink({ href, title, children, ...props }: ComponentPropsWithoutRef<"a">) {
    const Icon =
        title === "icon:linkedin" ? LinkedinLogo : title === "icon:github" ? GithubLogo : undefined;
    if (Icon) {
        const label = title === "icon:linkedin" ? "LinkedIn" : "GitHub";
        return (
            <a
                {...props}
                href={href}
                title={label}
                aria-label={label}
                className="markdown-icon-link"
            >
                <Icon size={20} weight="regular" aria-hidden="true" />
            </a>
        );
    }
    return href?.startsWith("/") && !href.startsWith("//") ? (
        <Link href={href} title={title} {...props}>
            {children}
        </Link>
    ) : (
        <a href={href} title={title} {...props}>
            {children}
        </a>
    );
}
