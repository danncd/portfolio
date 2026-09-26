import type { ReactNode } from "react";

type Props = {
    title: string;
    metadata?: ReactNode;
};

export function PageHeader({ title, metadata }: Props) {
    return (
        <header className="page-header fixed top-0 z-20 flex h-(--header-height) items-center bg-canvas">
            <div className="flex w-full min-w-0 items-center justify-between gap-4 px-6">
                <h1 className="min-w-0 truncate text-[14px] font-medium">{title}</h1>
                {metadata && (
                    <div className="shrink-0 text-[12px] whitespace-nowrap text-muted tabular-nums">
                        {metadata}
                    </div>
                )}
            </div>
        </header>
    );
}
