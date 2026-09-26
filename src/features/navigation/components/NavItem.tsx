"use client";

import Link from "next/link";
import { CaretRight } from "@phosphor-icons/react";
import type { MouseEvent } from "react";
import type { NavigationLink } from "../../content/model";
import { NavigationIcon } from "./NavigationIcon";

type Props = {
    item: NavigationLink;
    depth?: number;
    pathname: string;
    isExpanded: (id: string) => boolean;
    onToggle: (id: string) => void;
    onNavigate: () => void;
};

export function NavItem({ item, depth = 0, pathname, isExpanded, onToggle, onNavigate }: Props) {
    const children = item.children ?? [];
    const hasChildren = children.length > 0;
    const expanded = hasChildren && isExpanded(item.id);
    const active = item.href === pathname;
    const childrenId = `nav-children-${item.id}`;
    const label = (
        <>
            <NavigationIcon name={item.icon} />
            <span className="truncate">{item.label}</span>
        </>
    );
    const labelClass = "flex h-[37px] min-w-0 flex-1 items-center gap-[9px] rounded-control pr-2";
    // Indent the label, keeping the row background and click target full width.
    const labelStyle = { paddingLeft: 12 + depth * 21 };

    function handleNavigation(event: MouseEvent<HTMLAnchorElement>) {
        // Modified clicks open a separate tab and leave this page's mobile sidebar alone.
        if (
            !event.defaultPrevented &&
            event.button === 0 &&
            !event.metaKey &&
            !event.ctrlKey &&
            !event.shiftKey &&
            !event.altKey
        )
            onNavigate();
    }

    return (
        <li>
            <div
                className={`flex min-h-[37px] items-center rounded-control text-[13px] text-ink hover:bg-hover ${active ? "bg-hover font-medium" : ""}`}
            >
                {item.href ? (
                    <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={labelClass}
                        style={labelStyle}
                        onClick={handleNavigation}
                    >
                        {label}
                    </Link>
                ) : (
                    <span className={labelClass} style={labelStyle}>
                        {label}
                    </span>
                )}
                {hasChildren && (
                    <button
                        type="button"
                        className="flex size-[37px] shrink-0 cursor-pointer items-center justify-center rounded-control"
                        aria-label={`${expanded ? "Collapse" : "Expand"} ${item.label}`}
                        aria-expanded={expanded}
                        aria-controls={childrenId}
                        onClick={() => onToggle(item.id)}
                    >
                        <CaretRight
                            size={15}
                            aria-hidden="true"
                            className={`transition-transform duration-150 motion-reduce:transition-none ${expanded ? "rotate-90" : ""}`}
                        />
                    </button>
                )}
            </div>
            {hasChildren && (
                <ul id={childrenId} hidden={!expanded} className="mt-0.5 space-y-0.5">
                    {children.map((child) => (
                        <NavItem
                            key={child.id}
                            item={child}
                            depth={depth + 1}
                            pathname={pathname}
                            isExpanded={isExpanded}
                            onToggle={onToggle}
                            onNavigate={onNavigate}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
}
