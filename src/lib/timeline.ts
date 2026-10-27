import { segment } from "./geometry";

export const TOTAL = 4800;

const RANGES = {
	sidesA: [0, 0.09],
	sidesB: [0.09, 0.18],
	arcsAB: [0.18, 0.32],
	bisectorAB: [0.32, 0.42],
	arcsBC: [0.42, 0.56],
	bisectorBC: [0.56, 0.66],
	centre: [0.66, 0.72],
	sweep: [0.72, 1],
} as const;

export type Step = keyof typeof RANGES;

export function stepAt(t: number, step: Step) {
	const [from, to] = RANGES[step];
	return segment(t, from, to);
}

const CAPTIONS: [number, string][] = [
	[0.18, "1 · join A to B"],
	[0.32, "2 · join B to C"],
	[0.42, "3 · swing arcs from A and B"],
	[0.56, "4 · bisect AB"],
	[0.66, "5 · swing arcs from B and C"],
	[0.72, "6 · bisect BC"],
	[0.76, "7 · the bisectors cross at O"],
	[1.01, "8 · set the compass to OA and sweep"],
];

export function caption(t: number) {
	return CAPTIONS.find(([limit]) => t < limit)?.[1] ?? "";
}
