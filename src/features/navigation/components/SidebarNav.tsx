"use client";

import { usePathname } from "next/navigation";
import type { NavigationSection } from "../../content/model";
import { useNavigationExpansion } from "../hooks/useNavigationExpansion";
import { NavItem } from "./NavItem";

type Props = { sections: readonly NavigationSection[]; onNavigate: () => void };

function NavigationTree({ sections, pathname, onNavigate }: Props & { pathname: string }) {
    const { isExpanded, toggle } = useNavigationExpansion(sections, pathname);
    return (
        <nav aria-label="Main navigation" className="space-y-5">
            {sections.map((section) => (
                <section key={section.id} aria-labelledby={`section-${section.id}`}>
                    <h2
                        id={`section-${section.id}`}
                        className="flex h-[30px] items-center px-3 text-[13px] font-medium text-section"
                    >
                        {section.label}
                    </h2>
                    <ul className="mt-px space-y-0.5">
                        {section.items.map((item) => (
                            <NavItem
                                key={item.id}
                                item={item}
                                pathname={pathname}
                                isExpanded={isExpanded}
                                onToggle={toggle}
                                onNavigate={onNavigate}
                            />
                        ))}
                    </ul>
                </section>
            ))}
        </nav>
    );
}

export function SidebarNav({ sections, onNavigate }: Props) {
    const pathname = usePathname();
    return (
        <NavigationTree
            key={pathname}
            sections={sections}
            pathname={pathname}
            onNavigate={onNavigate}
        />
    );
}
