import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
	subsets: ["latin"],
	weight: ["100", "300", "400", "500", "700"],
});

export const metadata: Metadata = {
	title: "Danny Chu Yang | Personal Website",
	description: "My personal website showcasing my projects.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={`px-2`}>{children}</body>
		</html>
	);
}
