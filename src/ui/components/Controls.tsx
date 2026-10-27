import type { Mode } from "../../lib/geometry";
import type { Status } from "../useConstruction";

type ModePanelProps = {
	mode: Mode;
	status: Status;
	ready: boolean;
	onMode: (mode: Mode) => void;
	onDraw: () => void;
};

export function ModePanel({ mode, status, ready, onMode, onDraw }: ModePanelProps) {
	return (
		<div className="panel mode">
			<button type="button" aria-pressed={mode === "live"} onClick={() => onMode("live")}>
				instant
			</button>
			<button type="button" aria-pressed={mode === "step"} onClick={() => onMode("step")}>
				step
			</button>
			{mode === "step" && (
				<button
					type="button"
					className="primary"
					disabled={!ready || status === "playing"}
					onClick={onDraw}
				>
					{status === "playing"
						? "drawing…"
						: status === "done"
							? "redraw"
							: "draw circle"}
				</button>
			)}
		</div>
	);
}

type ZoomPanelProps = {
	readout: React.RefObject<HTMLSpanElement | null>;
	onZoom: (factor: number) => void;
	onReset: () => void;
};

export function ZoomPanel({ readout, onZoom, onReset }: ZoomPanelProps) {
	return (
		<div className="panel zoom">
			<button type="button" aria-label="Zoom out" onClick={() => onZoom(1 / 1.3)}>
				−
			</button>
			<span ref={readout}>100%</span>
			<button type="button" aria-label="Zoom in" onClick={() => onZoom(1.3)}>
				+
			</button>
			<button type="button" aria-label="Reset view" onClick={onReset}>
				reset
			</button>
		</div>
	);
}
