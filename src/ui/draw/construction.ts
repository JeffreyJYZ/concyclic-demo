import { bisector, lerp, type Point } from "../../lib/geometry";
import { stepAt } from "../../lib/timeline";

type Style = { accent: string; muted: string; thin: number; fade: number };

export function drawConstruction(
	ctx: CanvasRenderingContext2D,
	a: Point,
	b: Point,
	c: Point,
	t: number,
	style: Style,
) {
	const ab = bisector(a, b);
	const bc = bisector(b, c);

	const line = (alpha: number, from: Point, to: Point) => {
		ctx.strokeStyle = style.muted;
		ctx.globalAlpha = alpha * style.fade;
		ctx.lineWidth = style.thin;
		ctx.beginPath();
		ctx.moveTo(from.x, from.y);
		ctx.lineTo(to.x, to.y);
		ctx.stroke();
		ctx.globalAlpha = 1;
	};

	const arc = (centre: Point, radius: number, from: number, amount: number) => {
		if (amount <= 0) return;
		ctx.strokeStyle = style.accent;
		ctx.globalAlpha = 0.55 * style.fade;
		ctx.lineWidth = style.thin;
		ctx.beginPath();
		ctx.arc(centre.x, centre.y, radius, from, from + 2.1 * amount);
		ctx.stroke();
		ctx.globalAlpha = 1;
	};

	const sidesA = stepAt(t, "sidesA");
	if (sidesA > 0) line(0.75, a, lerp(a, b, sidesA));

	const sidesB = stepAt(t, "sidesB");
	if (sidesB > 0) line(0.75, b, lerp(b, c, sidesB));

	const arcsAB = stepAt(t, "arcsAB");
	arc(a, ab.radius, ab.angle - 1.05, arcsAB);
	arc(b, ab.radius, ab.angle + Math.PI - 1.05, arcsAB);

	const bisectorAB = stepAt(t, "bisectorAB");
	if (bisectorAB > 0) {
		line(0.75, lerp(ab.mid, ab.ends[0], bisectorAB), lerp(ab.mid, ab.ends[1], bisectorAB));
	}

	const arcsBC = stepAt(t, "arcsBC");
	arc(b, bc.radius, bc.angle - 1.05, arcsBC);
	arc(c, bc.radius, bc.angle + Math.PI - 1.05, arcsBC);

	const bisectorBC = stepAt(t, "bisectorBC");
	if (bisectorBC > 0) {
		line(0.75, lerp(bc.mid, bc.ends[0], bisectorBC), lerp(bc.mid, bc.ends[1], bisectorBC));
	}
}
