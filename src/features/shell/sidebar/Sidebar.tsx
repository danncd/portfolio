import type { ReactNode } from "react";

export function Sidebar({
    name,
    logo,
    open,
    children,
}: {
    name: string;
    logo: string | null;
    open: boolean;
    children: ReactNode;
}) {
    return (
        <aside id="sidebar" className="sidebar-panel bg-sidebar" inert={!open} aria-label="Sidebar">
            <div className="sidebar-inner flex h-full flex-col">
                <div className="flex h-(--header-height) shrink-0 items-center gap-2 pl-5 pr-14 text-[14px] font-semibold">
                    {logo && (
                        <span
                            aria-hidden="true"
                            className="size-[18px] -translate-y-[2px] shrink-0 bg-current"
                            style={{
                                maskImage: `url(${logo})`,
                                maskSize: "contain",
                                maskRepeat: "no-repeat",
                                maskPosition: "center",
                            }}
                        />
                    )}
                    <span className="truncate">{name}</span>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-2 pb-6">
                    {children}
                </div>
            </div>
        </aside>
    );
}
