"use client";
import { useEffect, useRef } from "react";

// Adaptación ligera de github.com/califa/swarm-site: unos pocos cursores
// "construyen" elementos reales de la página (seleccionan, subrayan texto,
// colocan guías, miden distancias, trazan con la pluma). Todo es decorativo
// (aria-hidden, sin eventos de puntero) y se anima fuera de React: cada cursor
// es un generador que avanza un fotograma por llamada a next(dt).

const CURSORS = [
	{ name: "Ada", color: "#F24E1E" },
	{ name: "Linus", color: "#A259FF" },
	{ name: "Grace", color: "#0ACF83" },
	{ name: "Alan", color: "#FF7262" },
	{ name: "Hedy", color: "#1ABCFE" },
	{ name: "Ken", color: "#FFC700" },
];

const BLUE = "#0D99FF";
const RED = "#F24822";
const TARGETS =
	"main h1, main h2, main h3, main p, main .button, main .tile, main li";
const TEXT = "h1, h2, h3, p, li";
const TOP = 80; // alto del header fijo
const BOTTOM = 30;

// Formas de cursor de swarm-site: [svg, origen x, origen y].
type Shape = "arrow" | "pen" | "ibeam" | "ew" | "ns";
const OUT = 'stroke="#fff" stroke-width="1.5" stroke-linejoin="round"';
const ARROW =
	"M4.6 3.9 C4.2 3.1 4.9 2.4 5.7 2.8 L20.6 9.4 C21.5 9.8 21.4 11.1 20.4 11.3 L13.9 12.9 C13.4 13 13 13.4 12.9 13.9 L11.3 20.4 C11.1 21.4 9.8 21.5 9.4 20.6 Z";
const IBEAM =
	"M8.5 4.5 H10.5 Q12 4.5 12 6 Q12 4.5 13.5 4.5 H15.5 M12 6 V18 M8.5 19.5 H10.5 Q12 19.5 12 18 Q12 19.5 13.5 19.5 H15.5";
const RESIZE =
	"M2.5 12 L7 7.5 V10.4 H17 V7.5 L21.5 12 L17 16.5 V13.6 H7 V16.5 Z";
const SHAPES: Record<Shape, [(c: string) => string, number, number]> = {
	arrow: [(c) => `<path d="${ARROW}" fill="${c}" ${OUT}/>`, 5, 3.5],
	pen: [
		(c) =>
			`<path d="M17.4 10.6 L20.6 13.8 L13.8 20.6 L10.6 17.4 Z" fill="${c}" ${OUT}/><path d="M3 3 L13.1 6.3 L17.4 10.6 L10.6 17.4 L6.3 13.1 Z" fill="${c}" ${OUT}/><path d="M3.6 3.6 L8.9 8.9" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/><circle cx="10.2" cy="10.2" r="1.75" fill="none" stroke="#fff" stroke-width="1.2"/>`,
		3,
		3,
	],
	ibeam: [
		(c) =>
			`<g fill="none" stroke-linecap="round"><path d="${IBEAM}" stroke="#fff" stroke-width="3.6"/><path d="${IBEAM}" stroke="${c}" stroke-width="1.5"/></g>`,
		12,
		12,
	],
	ew: [(c) => `<path d="${RESIZE}" fill="${c}" ${OUT}/>`, 12, 12],
	ns: [
		(c) =>
			`<path d="${RESIZE}" transform="rotate(90 12 12)" fill="${c}" ${OUT}/>`,
		12,
		12,
	],
};

type Pt = { x: number; y: number };
type Box = Pt & { w: number; h: number };
type Task = Generator<void, void, number>;
type Cursor = {
	x: number;
	y: number;
	px: number;
	angle: number;
	press: number;
	op: number;
	shape: Shape;
	drawn: Shape | null;
	color: string;
	claims: Element[];
	ov: (() => string) | null;
	gen: Task;
	root: HTMLDivElement;
	svg: SVGSVGElement;
};

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const ease = (t: number) =>
	t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
const n = (v: number) => v.toFixed(1);

// Rectángulo en coordenadas de documento: cursores y trazos viajan con el
// contenido al hacer scroll.
function pageRect(el: Element): Box {
	const r = el.getBoundingClientRect();
	return {
		x: r.left + window.scrollX,
		y: r.top + window.scrollY,
		w: r.width,
		h: r.height,
	};
}
const center = (b: Box) => ({ x: b.x + b.w / 2, y: b.y + b.h / 2 });

// Líneas de texto reales del elemento (una caja por renglón).
function textLines(el: Element): Box[] {
	const range = document.createRange();
	range.selectNodeContents(el);
	const rows = new Map<number, Box>();
	for (const r of range.getClientRects()) {
		if (r.width < 1) continue;
		const key = Math.round(r.top + r.height / 2);
		const row = rows.get(key);
		const x = r.left + window.scrollX;
		const y = r.top + window.scrollY;
		if (!row) rows.set(key, { x, y, w: r.width, h: r.height });
		else {
			const right = Math.max(row.x + row.w, x + r.width);
			row.x = Math.min(row.x, x);
			row.w = right - row.x;
		}
	}
	return [...rows.values()].sort((a, b) => a.y - b.y);
}

// Recorre los renglones hasta la fracción p del texto total.
function sweep(lines: Box[], p: number) {
	let left = p * lines.reduce((s, l) => s + l.w, 0);
	const rects: Box[] = [];
	const first = lines[0];
	let end: Pt = first
		? { x: first.x, y: first.y + first.h / 2 }
		: { x: 0, y: 0 };
	for (const l of lines) {
		const w = Math.min(l.w, left);
		if (w <= 0) break;
		rects.push({ ...l, w });
		end = { x: l.x + w, y: l.y + l.h / 2 };
		left -= w;
	}
	return { rects, end };
}

const box = (b: Box, color: string, handles = false) =>
	`<rect x="${n(b.x)}" y="${n(b.y)}" width="${n(b.w)}" height="${n(b.h)}" fill="none" stroke="${color}"/>${
		handles
			? [
					[b.x, b.y],
					[b.x + b.w, b.y],
					[b.x, b.y + b.h],
					[b.x + b.w, b.y + b.h],
				]
					.map(
						([x, y]) =>
							`<rect x="${n(x - 3.5)}" y="${n(y - 3.5)}" width="7" height="7" fill="#fff" stroke="${color}"/>`,
					)
					.join("")
			: ""
	}`;
const line = (a: Pt, b: Pt, color: string) =>
	`<line x1="${n(a.x)}" y1="${n(a.y)}" x2="${n(b.x)}" y2="${n(b.y)}" stroke="${color}"/>`;
const badge = (cx: number, top: number, text: string, color: string) => {
	const w = text.length * 6.6 + 8;
	return `<rect x="${n(cx - w / 2)}" y="${n(top)}" width="${n(w)}" height="16" rx="2" fill="${color}"/><text x="${n(cx)}" y="${n(top + 12)}" text-anchor="middle">${text}</text>`;
};

export default function BuilderCursors() {
	const layer = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const host = layer.current;
		// ponytail: solo escritorio con ratón y sin reduced-motion; en móvil 6
		// cursores tapan demasiado.
		const ok = matchMedia(
			"(min-width: 900px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
		);
		if (!host || !ok.matches) return;

		const overlay = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"svg",
		);
		overlay.classList.add("builder-overlay");
		host.append(overlay);

		const claimed = new Set<Element>();
		const inView = (el: Element) => {
			const r = el.getBoundingClientRect();
			return r.bottom > TOP - 10 && r.top < window.innerHeight;
		};
		const free = () =>
			[...document.querySelectorAll(TARGETS)].filter((el) => {
				if (claimed.has(el) || el.closest(".marquee")) return false;
				const r = el.getBoundingClientRect();
				return (
					r.width > 40 &&
					r.height > 14 &&
					r.width < window.innerWidth * 0.8 &&
					r.top > TOP + 10 &&
					r.bottom < window.innerHeight - BOTTOM
				);
			});
		// Preferir lo cercano: menos recorrido, menos ruido visual.
		const near = (c: Cursor, list: Element[]) => {
			const d = (el: Element) => {
				const p = center(pageRect(el));
				return Math.hypot(p.x - c.x, p.y - c.y);
			};
			const sorted = [...list].sort((a, b) => d(a) - d(b));
			return (
				sorted[Math.floor(Math.random() * Math.min(4, sorted.length))] ?? null
			);
		};
		const claim = (c: Cursor, ...els: Element[]) => {
			c.claims = els;
			for (const el of els) claimed.add(el);
			c.op = 1;
		};
		const release = (c: Cursor) => {
			for (const el of c.claims) claimed.delete(el);
			c.claims = [];
			c.ov = null;
			c.shape = "arrow";
		};

		// ── Primitivas de movimiento ──
		function* wait(s: number): Task {
			let left = s;
			while (left > 0) left -= yield;
		}
		function* moveTo(
			c: Cursor,
			to: () => Pt,
			dur?: number,
			bend?: number,
		): Task {
			const from = { x: c.x, y: c.y };
			const p0 = to();
			const d =
				dur ?? clamp(Math.hypot(p0.x - c.x, p0.y - c.y) / 1600, 0.2, 0.65);
			const bow = bend ?? rand(-0.12, 0.12);
			let t = 0;
			while (t < d) {
				t += yield;
				const e = ease(Math.min(1, t / d));
				const p = to();
				const dx = p.x - from.x;
				const dy = p.y - from.y;
				// Arco suave perpendicular al trayecto, como un pulso humano.
				const arc = Math.sin(Math.PI * e) * bow;
				c.x = from.x + dx * e - dy * arc;
				c.y = from.y + dy * e + dx * arc;
			}
		}
		function* click(c: Cursor): Task {
			c.press = 1;
			yield* wait(0.07);
		}
		function* hold(c: Cursor, s: number, pin: () => Pt): Task {
			let left = s;
			while (left > 0) {
				left -= yield;
				Object.assign(c, pin());
			}
		}
		function* fade(c: Cursor): Task {
			let t = 0;
			while (t < 0.25) {
				t += yield;
				c.op = Math.max(0, 1 - t / 0.25);
			}
		}
		// Reposo: el cursor acompaña al viewport con algo de retraso al hacer scroll.
		function* rest(c: Cursor, s: number): Task {
			let left = s;
			while (left > 0) {
				const dt = yield;
				left -= dt;
				const k = Math.min(1, dt * 5);
				const tx = clamp(
					c.x,
					window.scrollX + 30,
					window.scrollX + window.innerWidth - 60,
				);
				const ty = clamp(
					c.y,
					window.scrollY + TOP + 30,
					window.scrollY + window.innerHeight - 60,
				);
				c.x += (tx - c.x) * k;
				c.y += (ty - c.y) * k;
			}
		}

		// ── Acciones ──
		function* select(c: Cursor, el: Element): Task {
			yield* moveTo(c, () => pageRect(el));
			yield* click(c);
			c.ov = () => {
				const b = pageRect(el);
				return box(
					{ ...b, w: Math.max(0, c.x - b.x), h: Math.max(0, c.y - b.y) },
					BLUE,
				);
			};
			const corner = () => {
				const b = pageRect(el);
				return { x: b.x + b.w, y: b.y + b.h };
			};
			yield* moveTo(c, corner, rand(0.22, 0.4), rand(-0.04, 0.04));
			c.ov = () => {
				const b = pageRect(el);
				return (
					box(b, BLUE, true) +
					badge(
						b.x + b.w / 2,
						b.y + b.h + 6,
						`${Math.round(b.w)} × ${Math.round(b.h)}`,
						BLUE,
					)
				);
			};
			yield* hold(c, rand(0.5, 0.9), corner);
		}

		function* highlight(c: Cursor, el: Element): Task {
			c.shape = "ibeam";
			let p = 0;
			const at = () => sweep(textLines(el), p);
			yield* moveTo(c, () => at().end);
			yield* click(c);
			c.ov = () => {
				const { rects, end } = at();
				const fill = rects
					.map(
						(r) =>
							`<rect x="${n(r.x)}" y="${n(r.y)}" width="${n(r.w)}" height="${n(r.h)}" fill="${BLUE}" fill-opacity="0.28"/>`,
					)
					.join("");
				return (
					fill +
					line({ x: end.x, y: end.y - 9 }, { x: end.x, y: end.y + 9 }, BLUE)
				);
			};
			const total = textLines(el).reduce((s, l) => s + l.w, 0);
			const dur = clamp(total / 1400, 0.35, 1);
			let t = 0;
			while (t < dur) {
				t += yield;
				p = Math.min(1, t / dur);
				Object.assign(c, at().end);
			}
			yield* hold(c, rand(0.4, 0.8), () => at().end);
		}

		function* guide(c: Cursor, el: Element): Task {
			// Arrastra una guía desde la regla y la suelta alineada con el elemento.
			const vertical = Math.random() < 0.5;
			const fx = rand(0.15, 0.85);
			const fy = rand(0.3, 0.8);
			const ruler = () =>
				vertical
					? {
							x: window.scrollX + fx * window.innerWidth,
							y: window.scrollY + TOP + 6,
						}
					: {
							x: window.scrollX + 8,
							y: window.scrollY + fy * window.innerHeight,
						};
			yield* moveTo(c, ruler);
			yield* click(c);
			c.shape = vertical ? "ew" : "ns";
			const snapped = () => {
				const b = pageRect(el);
				return vertical
					? { x: b.x, y: window.scrollY + TOP + 6 }
					: { x: window.scrollX + 8, y: b.y };
			};
			let done = false;
			c.ov = () => {
				const sx = window.scrollX;
				const sy = window.scrollY;
				const g = vertical
					? line(
							{ x: c.x, y: sy },
							{ x: c.x, y: sy + window.innerHeight },
							RED,
						) + badge(c.x, c.y + 14, `${Math.round(c.x - sx)}`, RED)
					: line(
							{ x: sx, y: c.y },
							{ x: sx + window.innerWidth, y: c.y },
							RED,
						) + badge(c.x + 34, c.y - 8, `${Math.round(c.y - sy)}`, RED);
				return done ? g + box(pageRect(el), RED) : g;
			};
			yield* moveTo(c, snapped, rand(0.3, 0.5), 0);
			done = true;
			yield* hold(c, rand(0.5, 0.8), snapped);
		}

		function* measure(c: Cursor, a: Element, b: Element): Task {
			yield* moveTo(c, () => center(pageRect(a)));
			yield* click(c);
			c.ov = () => box(pageRect(a), BLUE, true);
			yield* moveTo(c, () => center(pageRect(b)));
			c.ov = () => {
				const A = pageRect(a);
				const B = pageRect(b);
				const x = (Math.max(A.x, B.x) + Math.min(A.x + A.w, B.x + B.w)) / 2;
				const y1 = A.y + A.h;
				const y2 = B.y;
				return (
					box(A, BLUE, true) +
					box(B, RED) +
					line({ x, y: y1 }, { x, y: y2 }, RED) +
					line({ x: x - 4, y: y1 }, { x: x + 4, y: y1 }, RED) +
					line({ x: x - 4, y: y2 }, { x: x + 4, y: y2 }, RED) +
					badge(x + 22, (y1 + y2) / 2 - 8, `${Math.round(y2 - y1)}`, RED)
				);
			};
			yield* hold(c, rand(0.6, 1), () => center(pageRect(b)));
		}

		function* pen(c: Cursor, el: Element): Task {
			c.shape = "pen";
			const corners = () => {
				const b = pageRect(el);
				const p = 6;
				return [
					{ x: b.x - p, y: b.y - p },
					{ x: b.x + b.w + p, y: b.y - p },
					{ x: b.x + b.w + p, y: b.y + b.h + p },
					{ x: b.x - p, y: b.y + b.h + p },
				];
			};
			let placed = 0;
			let closed = false;
			c.ov = () => {
				const pts = corners().slice(0, placed);
				const path = [...pts, closed ? pts[0] : { x: c.x, y: c.y }];
				const nodes = pts
					.map(
						(q) =>
							`<circle cx="${n(q.x)}" cy="${n(q.y)}" r="3.6" fill="#fff" stroke="${BLUE}" stroke-width="1.5"/>`,
					)
					.join("");
				return `<polyline points="${path.map((q) => `${n(q.x)},${n(q.y)}`).join(" ")}" fill="none" stroke="${BLUE}" stroke-width="1.5"/>${nodes}`;
			};
			for (let i = 0; i <= 4; i++) {
				yield* moveTo(c, () => corners()[i % 4], undefined, rand(-0.03, 0.03));
				yield* click(c);
				if (i < 4) placed = i + 1;
				else closed = true;
			}
			yield* hold(c, rand(0.4, 0.7), () => corners()[0]);
		}

		function* task(c: Cursor): Task {
			const list = free();
			const el = near(c, list);
			if (!el) return;
			const roll = Math.random();
			if (roll < 0.24) {
				const t = near(
					c,
					list.filter(
						(x) => x.matches(TEXT) && (x.textContent?.trim().length ?? 0) > 12,
					),
				);
				if (t) {
					claim(c, t);
					return yield* highlight(c, t);
				}
			} else if (roll < 0.42) {
				claim(c, el);
				return yield* guide(c, el);
			} else if (roll < 0.6) {
				// Pareja apilada con solape horizontal: medir el hueco entre ambas.
				const A = pageRect(el);
				const b = list
					.filter((x) => {
						if (x === el) return false;
						const B = pageRect(x);
						const gap = B.y - A.y - A.h;
						return (
							gap > 4 &&
							gap < 220 &&
							B.x < A.x + A.w - 20 &&
							B.x + B.w > A.x + 20
						);
					})
					.sort((x, y) => pageRect(x).y - pageRect(y).y)[0];
				if (b) {
					claim(c, el, b);
					return yield* measure(c, el, b);
				}
			} else if (roll < 0.76) {
				claim(c, el);
				return yield* pen(c, el);
			}
			claim(c, el);
			yield* select(c, el);
		}

		function* life(c: Cursor, delay: number): Task {
			yield* rest(c, delay);
			for (;;) {
				yield* task(c);
				if (c.ov) yield* fade(c);
				release(c);
				yield* rest(c, rand(0.25, 0.9));
			}
		}

		const cursors: Cursor[] = CURSORS.map(({ name, color }, i) => {
			const root = document.createElement("div");
			root.className = "builder-cursor";
			root.innerHTML = `<svg width="28" height="28" viewBox="0 0 28 28"></svg><span class="builder-cursor__label" style="background:${color}">${name}</span>`;
			host.append(root);
			// Entran escalonados desde los laterales.
			const x = i % 2 === 0 ? -40 : window.innerWidth + 40;
			const c: Cursor = {
				x,
				y: window.scrollY + rand(0.25, 0.75) * window.innerHeight,
				px: x,
				angle: 0,
				press: 0,
				op: 1,
				shape: "arrow",
				drawn: null,
				color,
				claims: [],
				ov: null,
				gen: wait(0),
				root,
				svg: root.firstElementChild as SVGSVGElement,
			};
			c.gen = life(c, i * 0.15);
			return c;
		});

		let raf = 0;
		let last = performance.now();
		let lastScroll = window.scrollY;
		let vel = 0;
		let html = "";
		const tick = (now: number) => {
			// Pestaña en segundo plano: no recuperar el tiempo perdido de golpe.
			const dt = Math.min(0.05, (now - last) / 1000);
			last = now;
			const sx = window.scrollX;
			const sy = window.scrollY;
			// Cuanto más rápido el scroll, más rápido trabajan.
			const speed = Math.abs(sy - lastScroll) / Math.max(dt, 0.001);
			vel += (speed - vel) * Math.min(1, dt * 6);
			lastScroll = sy;
			const tdt = dt * clamp(1 + vel / 1500, 1, 2.5);

			let next = "";
			for (const c of cursors) {
				// El objetivo salió de pantalla al hacer scroll: soltarlo y buscar otro.
				if (c.claims.length && !c.claims.every(inView)) {
					release(c);
					c.gen = life(c, 0.05);
				}
				c.gen.next(tdt);

				c.press = Math.max(0, c.press - dt * 6);
				const vx = (c.x - c.px) / Math.max(dt, 0.001);
				c.px = c.x;
				const tilt = c.shape === "arrow" ? clamp(vx / 120, -14, 14) : 0;
				c.angle += (tilt - c.angle) * Math.min(1, dt * 10);
				if (c.shape !== c.drawn) {
					c.svg.innerHTML = SHAPES[c.shape][0](c.color);
					c.drawn = c.shape;
				}
				const [, ox, oy] = SHAPES[c.shape];
				c.root.style.transform = `translate(${c.x - sx}px, ${c.y - sy}px)`;
				c.svg.style.transformOrigin = `${ox}px ${oy}px`;
				c.svg.style.transform = `translate(${-ox}px, ${-oy}px) rotate(${c.angle.toFixed(1)}deg) scale(${1 - c.press * 0.12})`;
				if (c.ov) next += `<g opacity="${c.op.toFixed(2)}">${c.ov()}</g>`;
			}
			next = `<g transform="translate(${-sx} ${-sy})">${next}</g>`;
			if (next !== html) {
				html = next;
				overlay.innerHTML = next;
			}
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);

		return () => {
			cancelAnimationFrame(raf);
			host.replaceChildren();
		};
	}, []);

	return <div ref={layer} className="builder-cursors" aria-hidden="true" />;
}
