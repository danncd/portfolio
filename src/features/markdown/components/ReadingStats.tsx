import { Clock } from "@phosphor-icons/react/dist/ssr";

type Props = {
    words: number;
    minutes: number;
    updatedAt: string;
};

export function ReadingStats({ words, minutes, updatedAt }: Props) {
    const date = new Date(updatedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "America/New_York",
    });
    return (
        <span className="inline-flex items-center gap-3">
            <span className="hidden sm:inline">
                {words.toLocaleString("en-US")} {words === 1 ? "word" : "words"}
            </span>
            <span
                className="inline-flex items-center gap-1.5 sm:border-l sm:border-divider sm:pl-3"
                aria-label={`Estimated reading time: ${minutes} ${minutes === 1 ? "minute" : "minutes"}`}
            >
                <Clock size={14} weight="regular" aria-hidden="true" />
                {minutes} min
            </span>
            <time
                dateTime={updatedAt}
                aria-label={`Updated ${date}`}
                className="border-l border-divider pl-3 max-[400px]:hidden"
            >
                <span className="hidden sm:inline">Updated </span>
                {date}
            </time>
        </span>
    );
}
