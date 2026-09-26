import Link from "next/link";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import type { ProjectSummary } from "@/features/content/model";

export function ProjectList({ projects }: { projects: readonly ProjectSummary[] }) {
    if (projects.length === 0) return null;

    return (
        <ul className="project-list" aria-label="Projects">
            {projects.map((project) => (
                <li key={project.id}>
                    <Link
                        href={project.href}
                        className="project-link flex min-h-10 cursor-pointer items-center justify-between gap-[18px] py-2"
                    >
                        <span className="min-w-0">
                            <span className="project-title font-medium">{project.title}</span>
                            <span className="text-muted">
                                <span aria-hidden="true"> → </span>
                                {project.description}
                            </span>
                        </span>
                        <CaretRight size={15} aria-hidden="true" className="shrink-0 text-muted" />
                    </Link>
                </li>
            ))}
        </ul>
    );
}
