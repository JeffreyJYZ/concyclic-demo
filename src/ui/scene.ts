import { isCollinear, solve, type Mode, type Point, type View } from "../lib/geometry";
import { caption, stepAt } from "../lib/timeline";
import { drawCentre, drawLiveCircle, drawSweep } from "./draw/circle";
import { drawConstruction } from "./draw/construction";
import { drawGrid } from "./draw/grid";
import { drawCollinear, drawPoints } from "./draw/points";

export type Scene = {
	points: Point[];
	view: View;
	mode: Mode;
	progress: number;
};

const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

function palette(canvas: HTMLElement) {
	const style = getComputedStyle(canvas);
	const read = (name: string, fallback: string) =>
		style.getPropertyValue(name).trim() || fallback;
	return {
		fg: read("--fg", "#e9edf3"),
		muted: read("--muted", "#69737f"),
		grid: read("--grid", "#1a2028"),
		accent: read("--accent", "#5fa8ff"),
	};
}

export function draw(canvas: HTMLCanvasElement, scene: Scene) {
	const ctx = canvas.getContext("2d");
	if (!ctx) return;

	const dpr = window.devicePixelRatio || 1;
	const width = canvas.clientWidth;
	const height = canvas.clientHeight;
	if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
		canvas.width = Math.round(width * dpr);
		canvas.height = Math.round(height * dpr);
	}

	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	ctx.clearRect(0, 0, width, height);

	const { fg, muted, grid, accent } = palette(canvas);
	const view = scene.view;
	const thin = 1 / view.scale;
	const points = scene.points;
	const circle = solve(points);
	const collinear = isCollinear(points);
	const step = scene.mode === "step";
	const t = step ? scene.progress : 1;

	drawGrid(ctx, view, width, height, grid);

	const world = (paint: () => void) => {
		ctx.save();
		ctx.translate(view.tx, view.ty);
		ctx.scale(view.scale, view.scale);
		ctx.lineJoin = "round";
		ctx.lineCap = "round";
		paint();
		ctx.restore();
	};

	if (circle && !collinear) {
		const [a, b, c] = points;
		if (!step) {
			world(() => drawLiveCircle(ctx, points, circle, { accent, thin }));
		} else if (t > 0) {
			world(() =>
				drawConstruction(ctx, a, b, c, t, { accent, muted, thin, fade: t >= 1 ? 0.5 : 1 }),
			);
			const sweep = stepAt(t, "sweep");
			if (sweep > 0) world(() => drawSweep(ctx, a, circle, sweep, { accent, thin }));
		}
	}

	if (collinear) world(() => drawCollinear(ctx, points, view, muted, thin));

	ctx.font = `12px ${MONO}`;
	if (circle && !collinear && (!step || t > 0.66)) {
		const growth = step ? stepAt(t, "centre") : 1;
		const label = !step || t > 0.999 ? `r ≈ ${circle.r.toFixed(1)}` : null;
		drawCentre(ctx, circle, view, growth, label, accent);
	}

	drawPoints(ctx, points, view, fg, muted);

	if (step && t > 0 && t < 1) {
		ctx.fillStyle = muted;
		ctx.font = `12px ${MONO}`;
		ctx.textAlign = "right";
		ctx.fillText(caption(t), width - 26, height - 58);
		ctx.textAlign = "left";
	}
}

export function drawScene(canvas: HTMLCanvasElement | null, scene: Scene) {
	if (canvas) draw(canvas, scene);
}
