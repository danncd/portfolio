
import Nav from "./components/Nav";
import { getProjects, Project } from "./lib/actions";
import Projects from "./components/Projects";
import AboutMe from "./components/AboutMe";

export default function Home() {
	const projects: Project[] = getProjects();
    const tags = ["All", ...new Set(projects.flatMap(p => p.tags).toSorted())];
    console.log(tags);

	return (
		<div className="max-w-190 w-full mx-auto my-4 px-2">
			<Nav />
            <AboutMe/>
            <Projects projects={projects} tags={tags}/>
		</div>
	);
}