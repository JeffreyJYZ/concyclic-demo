"use client";

import { useCallback, useEffect, useRef } from "react";
import { ModePanel, ZoomPanel } from "@/ui/components/Controls";
import { draw, type Scene } from "@/ui/scene";
import { useCamera } from "@/ui/useCamera";
import { useConstruction } from "@/ui/useConstruction";
import { usePointers } from "@/ui/usePointers";

export default function Home() {
	const canvas = useRef<HTMLCanvasElement>(null);
	const scene = useRef<Scene>({
		points: [],
		view: { scale: 1, tx: 0, ty: 0 },
		mode: "live",
		progress: 0,
	});

	const redraw = useCallback(() => {
		if (canvas.current) draw(canvas.current, scene.current);
	}, []);

	const construction = useConstruction(scene, redraw);
	const camera = useCamera(canvas, scene, redraw);
	const pointers = usePointers(scene, redraw, construction.edited);

	useEffect(() => {
		redraw();
		const el = canvas.current;
		if (!el) return;
		const observer = new ResizeObserver(redraw);
		observer.observe(el);
		const scheme = window.matchMedia("(prefers-color-scheme: dark)");
		scheme.addEventListener("change", redraw);
		return () => {
			observer.disconnect();
			scheme.removeEventListener("change", redraw);
		};
	}, [redraw]);

	return (
		<main>
			<canvas ref={canvas} {...pointers} />
			<header>
				<h1>Any three points are concyclic</h1>
				<p>
					Click to drop a point. Drag one to move it. Scroll or pinch to zoom. A fourth
					click clears the board.
				</p>
			</header>
			<ModePanel
				mode={construction.mode}
				status={construction.status}
				ready={construction.ready}
				onMode={construction.pick}
				onDraw={construction.start}
			/>
			<ZoomPanel readout={camera.readout} onZoom={camera.zoom} onReset={camera.reset} />
		</main>
	);
}
