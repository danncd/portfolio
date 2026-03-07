import fs from "fs";
import path from "path";

export type Project = {
	title: string;
	date: string;
	line1: string;
	line2: string;
	link: string;
	github: string;
	tags: string[];
};

export function getProjects(): Project[] {
	const filePath = path.join(process.cwd(), "src/app/data/projects.json");

	const fileContents = fs.readFileSync(filePath, "utf-8");

	return JSON.parse(fileContents) as Project[];
}