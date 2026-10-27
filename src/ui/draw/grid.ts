import type { View } from "../../lib/geometry";
import { toScreen } from "../camera";

export function drawGrid(
	ctx: CanvasRenderingContext2D,
	view: View,
	width: number,
	height: number,
	color: string,
) {
	let step = 28;
	while (step * view.scale < 12) step *= 2;

	const right = (width - view.tx) / view.scale;
	const bottom = (height - view.ty) / view.scale;
	ctx.fillStyle = color;

	for (let gx = Math.floor(-view.tx / view.scale / step) * step; gx < right; gx += step) {
		for (let gy = Math.floor(-view.ty / view.scale / step) * step; gy < bottom; gy += step) {
			const s = toScreen(view, { x: gx, y: gy });
			ctx.beginPath();
			ctx.arc(s.x, s.y, 1, 0, Math.PI * 2);
			ctx.fill();
		}
	}
}
