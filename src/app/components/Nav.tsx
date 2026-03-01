export default function Nav() {

	const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

	return (
		<nav className="flex flex-row justify-between">
			<div className="flex flex-col items-start justify-start">
				<h1 className="font-bold text-xl">Danny Chu Yang</h1>
				<span className="text-md text-gray-600">B.S., Major in Computer Science</span>
			</div>
			<div className="text-gray-600 sm:flex flex-col items-end justify-start">
				<span>Queens, NY</span>
			</div>
		</nav>
	);
}
