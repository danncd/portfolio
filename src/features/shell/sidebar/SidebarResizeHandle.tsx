import type { KeyboardEventHandler, PointerEventHandler } from "react";

type Props = {
    width: number;
    minimum: number;
    maximum: number;
    onPointerDown: PointerEventHandler<HTMLDivElement>;
    onKeyDown: KeyboardEventHandler<HTMLDivElement>;
};

export function SidebarResizeHandle({ width, minimum, maximum, ...events }: Props) {
    return (
        <div
            {...events}
            className="sidebar-resize"
            role="separator"
            tabIndex={0}
            aria-label="Resize sidebar"
            aria-controls="sidebar"
            aria-orientation="vertical"
            aria-valuenow={Math.max(minimum, Math.min(maximum, width))}
            aria-valuemin={minimum}
            aria-valuemax={maximum}
            aria-valuetext={`${Math.round(width)} pixels`}
            title="Drag to resize or collapse. Arrow keys resize; Shift for larger steps; Home and End for limits."
        />
    );
}
