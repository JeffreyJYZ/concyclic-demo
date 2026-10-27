export type Point = { x: number; y: number };
export type View = { scale: number; tx: number; ty: number };
export type Circle = { x: number; y: number; r: number };
export type Mode = "live" | "step";

export const LABELS = ["A", "B", "C"];
export const MAX_RADIUS = 1e7;

export function clamp(value: number, min: number, max: number) {
	return Math.min(max, Math.max(min, value));
}

export function lerp(a: Point, b: Point, t: number): Point {
	return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

export function ease(t: number) {
	return 1 - (1 - t) ** 3;
}

export function segment(t: number, from: number, to: number) {
	return ease(clamp((t - from) / (to - from), 0, 1));
}

export function circumcircle(a: Point, b: Point, c: Point): Circle | null {
	const d = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));
	if (Math.abs(d) < 1e-6) return null;
	const a2 = a.x * a.x + a.y * a.y;
	const b2 = b.x * b.x + b.y * b.y;
	const c2 = c.x * c.x + c.y * c.y;
	const x = (a2 * (b.y - c.y) + b2 * (c.y - a.y) + c2 * (a.y - b.y)) / d;
	const y = (a2 * (c.x - b.x) + b2 * (a.x - c.x) + c2 * (b.x - a.x)) / d;
	return { x, y, r: Math.hypot(a.x - x, a.y - y) };
}

export function solve(points: Point[]): Circle | null {
	return points.length === 3 ? circumcircle(points[0], points[1], points[2]) : null;
}

export function isCollinear(points: Point[]) {
	if (points.length !== 3) return false;
	const circle = solve(points);
	return !circle || circle.r > MAX_RADIUS;
}

export function isConstructible(points: Point[]) {
	return points.length === 3 && !isCollinear(points);
}

export function bisector(p: Point, q: Point) {
	const dx = q.x - p.x;
	const dy = q.y - p.y;
	const length = Math.hypot(dx, dy) || 1;
	const ux = dx / length;
	const uy = dy / length;
	const radius = length * 0.75;
	const height = Math.sqrt(Math.max(0, radius * radius - (length * length) / 4));
	const mid = { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 };
	const ends: [Point, Point] = [
		{ x: mid.x - uy * height * 1.35, y: mid.y + ux * height * 1.35 },
		{ x: mid.x + uy * height * 1.35, y: mid.y - ux * height * 1.35 },
	];
	return { mid, radius, angle: Math.atan2(uy, ux), ends };
}
