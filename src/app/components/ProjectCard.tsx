import Link from "next/link";
import type { Project } from "../lib/actions";

type ProjectProps = {
    project: Project;
};

export default function ProjectCard({ project }: ProjectProps) {
	return (
		<div className="flex flex-row">
			<div className="border-r-gray-300 border-r-4 mr-3 ml-1" />
			<div className="flex flex-col gap-2">
				<div className="flex flex-col">
					<span className="font-bold text-lg">{project.title}</span>
					<div className="flex items-center gap-3 text-sm text-gray-700">
						<span className="text-gray-600">{project.date}</span>
						<span className="h-1.5 w-1.5 rounded-full bg-gray-700"></span>
						<Link href={project.link} target="_blank" className="cursor-pointer underline">Website</Link>
						<span className="h-1.5 w-1.5 rounded-full bg-gray-700"></span>
						<Link href={project.github} target="_blank" className="cursor-pointer underline">Github</Link>
					</div>
				</div>
				<span>
					{project.line1}
				</span>
				<span>
					{project.line2}
				</span>
			</div>
		</div>
	);
}
