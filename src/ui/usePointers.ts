import { useRef } from "react";
import { clamp, type Point } from "../lib/geometry";
import { MAX_SCALE, MIN_SCALE, toScreen, toWorld } from "./camera";
import type { Scene } from "./scene";

const HIT = 16;

export function usePointers(scene: React.RefObject<Scene>, redraw: () => void, onEdit: () => void) {
	const pointers = useRef(new Map<number, Point>());
	const pinch = useRef<{ dist: number; scale: number; anchor: Point } | null>(null);
	const dragging = useRef<number | null>(null);
	const fresh = useRef<number | null>(null);

	const local = (event: React.PointerEvent<HTMLCanvasElement>) => {
		const rect = event.currentTarget.getBoundingClientRect();
		return { x: event.clientX - rect.left, y: event.clientY - rect.top };
	};

	const onPointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
		const el = event.currentTarget;
		const at = local(event);
		const view = scene.current.view;
		const points = scene.current.points;
		pointers.current.set(event.pointerId, at);

		if (pointers.current.size === 2) {
			const [a, b] = [...pointers.current.values()];
			if (fresh.current !== null) {
				points.splice(fresh.current, 1);
				fresh.current = null;
			}
			dragging.current = null;
			const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
			pinch.current = {
				dist: Math.hypot(b.x - a.x, b.y - a.y),
				scale: view.scale,
				anchor: toWorld(view, mid),
			};
			onEdit();
			redraw();
			return;
		}

		if (pointers.current.size > 2) return;

		const found = points.findIndex((point) => {
			const s = toScreen(view, point);
			return Math.hypot(s.x - at.x, s.y - at.y) <= HIT;
		});

		if (found >= 0) {
			dragging.current = found;
		} else {
			if (points.length >= 3) points.length = 0;
			points.push(toWorld(view, at));
			dragging.current = points.length - 1;
			fresh.current = dragging.current;
		}

		onEdit();
		try {
			el.setPointerCapture(event.pointerId);
		} catch {
			// a synthetic or already-released pointer has nothing to capture
		}
		redraw();
	};

	const onPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
		if (!pointers.current.has(event.pointerId)) return;
		const at = local(event);
		pointers.current.set(event.pointerId, at);

		const grip = pinch.current;
		if (grip && pointers.current.size >= 2) {
			const [a, b] = [...pointers.current.values()];
			const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
			const spread = Math.hypot(b.x - a.x, b.y - a.y);
			const view = scene.current.view;
			view.scale = clamp(grip.scale * (spread / (grip.dist || 1)), MIN_SCALE, MAX_SCALE);
			view.tx = mid.x - grip.anchor.x * view.scale;
			view.ty = mid.y - grip.anchor.y * view.scale;
			redraw();
			return;
		}

		if (dragging.current === null) return;
		scene.current.points[dragging.current] = toWorld(scene.current.view, at);
		onEdit();
		redraw();
	};

	const onPointerUp = (event: React.PointerEvent<HTMLCanvasElement>) => {
		pointers.current.delete(event.pointerId);
		if (pointers.current.size < 2) pinch.current = null;
		dragging.current = null;
		fresh.current = null;
	};

	return { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp };
}
