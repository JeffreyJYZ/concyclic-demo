import { clamp, type Point, type View } from "../lib/geometry";

export const MIN_SCALE = 0.15;
export const MAX_SCALE = 12;

export function toScreen(view: View, p: Point): Point {
	return { x: p.x * view.scale + view.tx, y: p.y * view.scale + view.ty };
}

export function toWorld(view: View, p: Point): Point {
	return { x: (p.x - view.tx) / view.scale, y: (p.y - view.ty) / view.scale };
}

export function zoomAt(view: View, x: number, y: number, scale: number) {
	const next = clamp(scale, MIN_SCALE, MAX_SCALE);
	const anchor = toWorld(view, { x, y });
	view.scale = next;
	view.tx = x - anchor.x * next;
	view.ty = y - anchor.y * next;
}

export function zoomBy(view: View, width: number, height: number, factor: number) {
	zoomAt(view, width / 2, height / 2, view.scale * factor);
}

export function resetView(view: View) {
	view.scale = 1;
	view.tx = 0;
	view.ty = 0;
}

export function wheelScale(scale: number, event: { deltaY: number; ctrlKey: boolean }) {
	const intensity = event.ctrlKey ? 0.01 : 0.0015;
	return scale * Math.exp(-event.deltaY * intensity);
}
