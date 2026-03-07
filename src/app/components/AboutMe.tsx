import Link from "next/link";

export default function AboutMe() {
	return (
		<section className="my-8 flex flex-col gap-6">
			<h2 className="font-bold text-xl">About Me</h2>
			<div className="flex flex-col gap-4">
				<p>
					Hello! I'm a computer science student, currently exploring
					full-stack web development, cloud technologies, and machine
					learning.
				</p>
				<div className="flex flex-row gap-2 items-center">
					<Link
						href={"https://www.linkedin.com/in/danncd/"}
						target="_blank"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							x="0px"
							y="0px"
							width="30"
							height="30"
							viewBox="0 0 48 48"
						>
							<path
								fill="#0288d1"
								d="M24 4A20 20 0 1 0 24 44A20 20 0 1 0 24 4Z"
							></path>
							<path
								fill="#fff"
								d="M14 19H18V34H14zM15.988 17h-.022C14.772 17 14 16.11 14 14.999 14 13.864 14.796 13 16.011 13c1.217 0 1.966.864 1.989 1.999C18 16.11 17.228 17 15.988 17zM35 24.5c0-3.038-2.462-5.5-5.5-5.5-1.862 0-3.505.928-4.5 2.344V19h-4v15h4v-8c0-1.657 1.343-3 3-3s3 1.343 3 3v8h4C35 34 35 24.921 35 24.5z"
							></path>
						</svg>
					</Link>
					<Link href={"https://github.com/danncd"} target="_blank">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="30"
							height="30"
							viewBox="0 0 30 30"
							className="fill-current text-black dark:text-white"
						>
							<path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
						</svg>
					</Link>
					<span className="h-1.5 w-1.5 rounded-full bg-gray-700 dark:bg-gray-400 mx-2"></span>
					<a
						href="mailto:cdannychu@gmail.com"
						className="underline cursor-pointer"
					>
						cdannychu@gmail.com
					</a>
				</div>
			</div>
		</section>
	);
}
