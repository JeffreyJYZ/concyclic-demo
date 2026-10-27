import type { Metadata } from "next";
import type { ReactNode } from "react";
import { css } from "@/ui/styles";

export const metadata: Metadata = {
	title: "Any three points",
	description: "Pick three points and watch the one circle through them.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<body>
				<style>{css}</style>
				{children}
			</body>
		</html>
	);
}
