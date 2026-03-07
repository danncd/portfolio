"use client";

import { useEffect, useState } from "react";

export default function Nav() {

	const [darkMode, setDarkMode] = useState(false);

	useEffect(() => {
		const root= document.documentElement;
		if (darkMode) {
			root.classList.add("dark");
		} else {
			root.classList.remove("dark");
		}
	}, [darkMode]);

	return (
		<nav className="flex flex-row justify-between">
			<div className="flex flex-col items-start justify-start">
				<h1 className="font-bold text-xl">Danny Chu Yang</h1>
				<span className="text-md text-gray-600 dark:text-gray-400">B.S., Major in Computer Science</span>
			</div>
			<div className="text-gray-600 flex flex-col items-end">
				<span className="dark:text-gray-400">Queens, NY</span>
				<span className="flex items-center h-full">
					<button
						onClick={() => setDarkMode(!darkMode)}
						className={`w-10 h-5 flex items-center rounded-full	pl-0.5 pr-0.5 cursor-pointer transition-colors duration-300
						${darkMode ? "bg-green-500" : "bg-gray-300"}`}
					>
						<div
						className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300
							${darkMode ? "translate-x-5" : "translate-x-0"}`}
						></div>
					</button>
				</span>
			</div>
		</nav>
	);
}
