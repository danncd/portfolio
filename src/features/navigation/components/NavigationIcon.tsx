import {
    User,
    Code,
    CalendarBlank,
    PaintBrush,
    Folder,
    Globe,
    FileText,
    GithubLogo,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import type { IconName } from "../../content/config/iconNames";

const icons = {
    user: User,
    code: Code,
    calendar: CalendarBlank,
    paintbrush: PaintBrush,
    folder: Folder,
    globe: Globe,
    "file-text": FileText,
    github: GithubLogo,
} satisfies Record<Exclude<IconName, "list">, Icon>;

export function NavigationIcon({ name }: { name?: IconName }) {
    if (!name) return null;
    if (name === "list") {
        return (
            <svg
                width={15}
                height={15}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="shrink-0"
            >
                <path d="M4 6.5h16M4 12h16M4 17.5h9" />
            </svg>
        );
    }
    const Symbol = icons[name];
    return <Symbol size={15} weight="regular" aria-hidden="true" className="shrink-0" />;
}
