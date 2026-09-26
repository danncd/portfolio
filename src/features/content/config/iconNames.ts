export const iconNames = [
    "user",
    "code",
    "calendar",
    "paintbrush",
    "folder",
    "globe",
    "file-text",
    "github",
    "list",
] as const;
export type IconName = (typeof iconNames)[number];
