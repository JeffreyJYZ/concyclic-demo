export const css = `
:root {
	color-scheme: dark light;
	--bg: #0a0c10;
	--fg: #e9edf3;
	--muted: #69737f;
	--grid: #1a2028;
	--accent: #5fa8ff;
}
@media (prefers-color-scheme: light) {
	:root {
		--bg: #f6f7f9;
		--fg: #11151b;
		--muted: #6d7683;
		--grid: #dde2e9;
		--accent: #1c6fe0;
	}
}
*, *::before, *::after { box-sizing: border-box; }
html, body { height: 100%; margin: 0; }
body {
	background: var(--bg);
	color: var(--fg);
	font: 14px/1.55 system-ui, ui-sans-serif, sans-serif;
	overflow: hidden;
	-webkit-font-smoothing: antialiased;
}
main { position: fixed; inset: 0; }
canvas {
	display: block;
	width: 100%;
	height: 100%;
	touch-action: none;
	cursor: crosshair;
}
header {
	position: absolute;
	inset: 0 0 auto 0;
	padding: clamp(16px, 3vw, 28px) clamp(18px, 3.4vw, 34px);
	pointer-events: none;
}
h1 {
	margin: 0 0 6px;
	font-size: 11px;
	font-weight: 600;
	letter-spacing: 0.2em;
	text-transform: uppercase;
	color: var(--muted);
}
p { margin: 0; max-width: 44ch; font-size: 12.5px; color: var(--muted); }
.panel {
	position: absolute;
	display: flex;
	align-items: center;
	gap: 6px;
	font: 11px/1 ui-monospace, SFMono-Regular, Menlo, monospace;
}
.panel button {
	height: 30px;
	min-width: 30px;
	padding: 0 10px;
	font: inherit;
	letter-spacing: 0.06em;
	color: var(--muted);
	background: transparent;
	border: 1px solid var(--grid);
	border-radius: 6px;
	cursor: pointer;
	transition: color 0.15s, border-color 0.15s;
}
.panel button:hover:enabled { color: var(--fg); border-color: var(--muted); }
.panel button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.panel button[aria-pressed="true"] { color: var(--fg); border-color: var(--accent); }
.panel button.primary { color: var(--accent); border-color: var(--accent); }
.panel button:disabled { opacity: 0.4; cursor: default; }
.panel span {
	min-width: 44px;
	text-align: center;
	color: var(--muted);
	font-variant-numeric: tabular-nums;
}
.zoom { right: clamp(14px, 2.6vw, 26px); bottom: clamp(14px, 2.6vw, 26px); }
.mode { right: clamp(14px, 2.6vw, 26px); top: clamp(14px, 2.6vw, 26px); }
`;
