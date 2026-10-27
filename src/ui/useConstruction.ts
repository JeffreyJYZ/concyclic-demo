import { useCallback, useEffect, useRef, useState } from "react";
import { clamp, isConstructible, type Mode } from "../lib/geometry";
import { TOTAL } from "../lib/timeline";
import type { Scene } from "./scene";

export type Status = "idle" | "playing" | "done";

export function useConstruction(scene: React.RefObject<Scene>, redraw: () => void) {
	const frame = useRef(0);
	const [status, setStatus] = useState<Status>("idle");
	const [mode, setMode] = useState<Mode>("live");
	const [ready, setReady] = useState(false);

	const stop = useCallback(() => {
		cancelAnimationFrame(frame.current);
		frame.current = 0;
		scene.current.progress = 0;
		setStatus("idle");
	}, [scene]);

	const start = useCallback(() => {
		if (!isConstructible(scene.current.points)) return;

		cancelAnimationFrame(frame.current);
		scene.current.progress = 0;
		setStatus("playing");
		const born = performance.now();

		const tick = (now: number) => {
			scene.current.progress = clamp((now - born) / TOTAL, 0, 1);
			redraw();
			if (scene.current.progress < 1) {
				frame.current = requestAnimationFrame(tick);
			} else {
				frame.current = 0;
				setStatus("done");
			}
		};
		frame.current = requestAnimationFrame(tick);
	}, [scene, redraw]);

	const pick = useCallback(
		(next: Mode) => {
			stop();
			scene.current.mode = next;
			setMode(next);
			redraw();
		},
		[scene, redraw, stop],
	);

	const edited = useCallback(() => {
		setReady(isConstructible(scene.current.points));
		if (scene.current.mode === "step" && scene.current.progress > 0) stop();
	}, [scene, stop]);

	useEffect(() => {
		return () => cancelAnimationFrame(frame.current);
	}, []);

	return { status, mode, ready, start, stop, pick, edited };
}
