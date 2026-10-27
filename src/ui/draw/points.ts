import { LABELS, type Point, type View } from "../../lib/geometry";
import { toScreen } from "../camera";

export function drawPoints(
	ctx: CanvasRenderingContext2D,
	points: Point[],
	view: View,
	foreground: string,
	muted: string,
) {
	points.forEach((point, index) => {
		const s = toScreen(view, point);
		ctx.fillStyle = foreground;
		ctx.beginPath();
		ctx.arc(s.x, s.y, 5, 0, Math.PI * 2);
		ctx.fill();

		ctx.fillStyle = muted;
		ctx.font = "600 11px ui-monospace, SFMono-Regular, Menlo, monospace";
		ctx.fillText(LABELS[index], s.x + 10, s.y - 10);
	});
}

export function drawCollinear(
	ctx: CanvasRenderingContext2D,
	points: Point[],
	view: View,
	muted: string,
	thin: number,
) {
	if (points.length !== 3) return;

	let from = points[0];
	let to = points[1];
	let span = -1;
	for (let i = 0; i < points.length; i++) {
		for (let j = i + 1; j < points.length; j++) {
			const dist = Math.hypot(points[j].x - points[i].x, points[j].y - points[i].y);
			if (dist > span) {
				span = dist;
				from = points[i];
				to = points[j];
			}
		}
	}

	const length = span || 1;
	const ux = (to.x - from.x) / length;
	const uy = (to.y - from.y) / length;

	ctx.strokeStyle = muted;
	ctx.lineWidth = thin;
	ctx.setLineDash([5 * thin, 5 * thin]);
	ctx.beginPath();
	ctx.moveTo(from.x - ux * 4000, from.y - uy * 4000);
	ctx.lineTo(to.x + ux * 4000, to.y + uy * 4000);
	ctx.stroke();
	ctx.setLineDash([]);

	const cx = points.reduce((sum, p) => sum + p.x, 0) / 3;
	const cy = points.reduce((sum, p) => sum + p.y, 0) / 3;
	const label = toScreen(view, { x: cx, y: cy });
	ctx.fillStyle = muted;
	ctx.font = "12px ui-monospace, SFMono-Regular, Menlo, monospace";
	ctx.fillText("collinear — the radius runs to infinity", label.x + 14, label.y - 14);
}
