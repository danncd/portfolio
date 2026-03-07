"use client";

import { useState } from "react";
import type { Project } from "../lib/actions";
import ProjectCard from "./ProjectCard";

type ProjectProps = {
	tags: string[];
    projects: Project[];
};

export default function Projects({ tags, projects } : ProjectProps) {

    const [selectedTag, setSelectedTag] = useState("All");
    
	return (
		<section className="my-8 flex flex-col gap-6">
			<h2 className="font-bold text-xl">Projects</h2>
			<div className="flex gap-2 flex-wrap">
				{tags.map((tag) => (
					<button
						key={tag}
						className={`${selectedTag === tag
                            ? "bg-black dark:bg-blue-500 text-white"
                            : "bg-gray-200 hover:bg-gray-300"}
                            px-2 py-1 text-sm text-black rounded-md cursor-pointer`}
                        onClick={() => setSelectedTag(tag)}
					>
						{tag}
					</button>
				))}
			</div>
			<div className="flex flex-col gap-8">
				{projects
                    .filter(project => selectedTag === "All" || project.tags.includes(selectedTag))
                    .map(project => (
                    <ProjectCard project={project} key={project.title} />
                ))}
			</div>
		</section>
	);
}
