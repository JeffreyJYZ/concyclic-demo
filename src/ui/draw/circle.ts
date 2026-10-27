import type { Circle, Point, View } from "../../lib/geometry";
import { toScreen } from "../camera";

type Style = { accent: string; thin: number };

export function drawLiveCircle(
	ctx: CanvasRenderingContext2D,
	points: Point[],
	circle: Circle,
	style: Style,
) {
	ctx.strokeStyle = style.accent;
	ctx.lineWidth = 1.5 * style.thin;
	ctx.beginPath();
	ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2);
	ctx.stroke();

	ctx.save();
	ctx.globalAlpha = 0.4;
	ctx.setLineDash([4 * style.thin, 5 * style.thin]);
	ctx.lineWidth = style.thin;
	ctx.beginPath();
	for (const point of points) {
		ctx.moveTo(circle.x, circle.y);
		ctx.lineTo(point.x, point.y);
	}
	ctx.stroke();
	ctx.restore();
}

export function drawSweep(
	ctx: CanvasRenderingContext2D,
	from: Point,
	circle: Circle,
	amount: number,
	style: Style,
) {
	const start = Math.atan2(from.y - circle.y, from.x - circle.x);
	const end = start + Math.PI * 2 * amount;

	ctx.strokeStyle = style.accent;
	ctx.lineWidth = 1.5 * style.thin;
	ctx.beginPath();
	ctx.arc(circle.x, circle.y, circle.r, start, end);
	ctx.stroke();

	const head = {
		x: circle.x + Math.cos(end) * circle.r,
		y: circle.y + Math.sin(end) * circle.r,
	};
	ctx.globalAlpha = 0.55;
	ctx.lineWidth = style.thin;
	ctx.beginPath();
	ctx.moveTo(circle.x, circle.y);
	ctx.lineTo(head.x, head.y);
	ctx.stroke();
	ctx.globalAlpha = 1;

	ctx.fillStyle = style.accent;
	ctx.beginPath();
	ctx.arc(head.x, head.y, 3 * style.thin, 0, Math.PI * 2);
	ctx.fill();
}

export function drawCentre(
	ctx: CanvasRenderingContext2D,
	circle: Circle,
	view: View,
	growth: number,
	label: string | null,
	accent: string,
) {
	const c = toScreen(view, circle);
	ctx.fillStyle = accent;
	ctx.beginPath();
	ctx.arc(c.x, c.y, 3 * growth, 0, Math.PI * 2);
	ctx.fill();
	ctx.font = "12px ui-monospace, SFMono-Regular, Menlo, monospace";
	ctx.fillText("O", c.x + 10, c.y + 16);
	if (label) ctx.fillText(label, c.x + 12, c.y - 12);
}
