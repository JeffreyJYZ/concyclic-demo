import { useCallback, useEffect, useRef } from "react";
import { resetView, wheelScale, zoomAt, zoomBy } from "./camera";
import type { Scene } from "./scene";

export function useCamera(
	canvas: React.RefObject<HTMLCanvasElement | null>,
	scene: React.RefObject<Scene>,
	redraw: () => void,
) {
	const readout = useRef<HTMLSpanElement>(null);

	const sync = useCallback(() => {
		if (readout.current) {
			readout.current.textContent = `${Math.round(scene.current.view.scale * 100)}%`;
		}
	}, [scene]);

	useEffect(() => {
		const el = canvas.current;
		if (!el) return;

		const onWheel = (event: WheelEvent) => {
			event.preventDefault();
			const rect = el.getBoundingClientRect();
			const view = scene.current.view;
			zoomAt(
				view,
				event.clientX - rect.left,
				event.clientY - rect.top,
				wheelScale(view.scale, event),
			);
			sync();
			redraw();
		};

		el.addEventListener("wheel", onWheel, { passive: false });
		return () => el.removeEventListener("wheel", onWheel);
	}, [canvas, scene, redraw, sync]);

	const zoom = useCallback(
		(factor: number) => {
			const el = canvas.current;
			if (!el) return;
			zoomBy(scene.current.view, el.clientWidth, el.clientHeight, factor);
			sync();
			redraw();
		},
		[canvas, scene, redraw, sync],
	);

	const reset = useCallback(() => {
		resetView(scene.current.view);
		sync();
		redraw();
	}, [scene, redraw, sync]);

	return { readout, zoom, reset };
}
