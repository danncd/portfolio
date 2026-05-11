import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
	subsets: ["latin"],
	weight: ["100", "300", "400", "500", "700"],
});

export const metadata: Metadata = {
	title: "Danny Chu Yang | Personal Website",
	description: "Personal website showcasing my projects.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {

	return (
		<html lang="en">
			<body className={`dark:bg-[#121212] dark:text-gray-100 p-4`}>
				<div className="max-w-255 w-full mx-auto">
					{children}
				</div>
			</body>
		</html>
	);
}
