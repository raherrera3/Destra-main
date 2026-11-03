"use client";
import { builderMedia } from "@/lib/site";
import { useEffect, useRef } from "react";

// Adaptación de github.com/califa/swarm-site: seis cursores construyen la home
// a medida que entra en pantalla. Cada componente arranca oculto (clase
// `building` que pone el script del layout antes del primer pintado) y aparece
// mientras un cursor lo dibuja: caja arrastrada, texto tecleado o trazo de
// pluma. Cada componente se construye una sola vez (a lo sumo con una guía
// previa); sin nada a la vista, los cursores esperan a que se haga scroll.
// Se anima fuera de React: cada cursor es un generador que avanza un fotograma
// por llamada a next(dt).

const CURSORS = [
	{ name: "Ada", color: "#F24E1E" },
	{ name: "Linus", color: "#A259FF" },
	{ name: "Grace", color: "#0ACF83" },
	{ name: "Alan", color: "#FF7262" },
	{ name: "Hedy", color: "#1ABCFE" },
	{ name: "Ken", color: "#FFC700" },
];

// Qué se construye y cómo. Mismos selectores que la regla html.building de
// globals.css; el orden importa (gana el primero que coincide).
type Kind = "pen" | "box" | "text";
const KINDS: Array<[string, Kind]> = [
	[".tile__top", "pen"],
	[
		".tile, .button, .process-steps > li, .faq-list details, .hero-facts li, .tile__meta, .marquee",
		"box",
	],
	[
		"h1, h2, h3, p, .section-index, .process-step__num, .tile__cta, summary > span",
		"text",
	],
];
const UNITS = `:is(${KINDS.map(([s]) => s).join(", ")}):not(details > p, .marquee *)`;
const kindOf = (el: Element): Kind =>
	KINDS.find(([s]) => el.matches(s))?.[1] ?? "box";

const BLUE = "#0D99FF";
const RED = "#F24822";
const TOP = 80; // alto del header fijo
const PATIENCE = 5; // s a la vista sin cursor libre antes de mostrarlo sin más

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
	unit: HTMLElement | null;
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

// Recorte en escalera: renglones completos arriba y el actual hasta el caret.
function staircase(b: Box, rects: Box[]) {
	const cur = rects[rects.length - 1];
	if (!cur) return "inset(0 100% 100% 0)";
	const w = n(b.w);
	const top = n(cur.y - b.y);
	const bottom = n(cur.y + cur.h - b.y);
	const x = n(cur.x + cur.w - b.x);
	return `polygon(0 0, ${w}px 0, ${w}px ${top}px, ${x}px ${top}px, ${x}px ${bottom}px, 0 ${bottom}px)`;
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
const size = (b: Box) =>
	badge(
		b.x + b.w / 2,
		b.y + b.h + 6,
		`${Math.round(b.w)} × ${Math.round(b.h)}`,
		BLUE,
	);

export default function BuilderCursors() {
	const layer = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const host = layer.current;
		const html = document.documentElement;
		// Sin la clase no hay nada oculto que construir (móvil, reduced-motion o
		// el script del layout ya se rindió).
		if (
			!host ||
			!matchMedia(builderMedia).matches ||
			!html.classList.contains("building")
		)
			return;
		(window as Window & { __builder?: boolean }).__builder = true;

		const overlay = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"svg",
		);
		overlay.classList.add("builder-overlay");
		host.append(overlay);

		const claimed = new Set<Element>();
		const seen = new WeakMap<Element, number>();
		let clock = 0;
		let cache: HTMLElement[] | null = null;

		const done = (el: HTMLElement) => {
			el.style.clipPath = "";
			delete el.dataset.build;
			el.dataset.built = "";
		};
		const start = (el: HTMLElement, clip: string) => {
			el.style.clipPath = clip;
			el.dataset.build = "";
		};

		// Componentes listos para construir: a la vista, sin dueño y con su
		// contenedor ya construido. Se calcula una vez por fotograma.
		const avail = () => {
			if (cache) return cache;
			cache = [];
			const main = document.querySelector("main");
			if (!main) return cache;
			for (const el of main.querySelectorAll<HTMLElement>(UNITS)) {
				if ("built" in el.dataset || claimed.has(el)) continue;
				const r = el.getBoundingClientRect();
				if (r.width < 2 || r.height < 2) continue;
				// Ya quedó por encima: nadie lo verá construirse.
				if (r.bottom < TOP) {
					done(el);
					continue;
				}
				if (r.top > window.innerHeight - 40) continue;
				const parent = el.parentElement?.closest<HTMLElement>(UNITS);
				if (parent && main.contains(parent) && !("built" in parent.dataset))
					continue;
				const first = seen.get(el) ?? clock;
				seen.set(el, first);
				if (clock - first > PATIENCE) {
					done(el);
					continue;
				}
				cache.push(el);
			}
			return cache;
		};
		const free = () => avail().filter((el) => !claimed.has(el));
		const inView = (el: Element) => {
			const r = el.getBoundingClientRect();
			return r.bottom > TOP - 10 && r.top < window.innerHeight;
		};
		// Preferir lo cercano: menos recorrido, menos ruido visual.
		const pick = (c: Cursor) => {
			const d = (el: Element) => {
				const b = pageRect(el);
				return Math.hypot(b.x - c.x, b.y - c.y);
			};
			const list = free().sort((a, b) => d(a) - d(b));
			return list[Math.floor(Math.random() * Math.min(3, list.length))];
		};
		const release = (c: Cursor) => {
			if (c.unit) {
				// Abortado por scroll: se termina de golpe, ya está fuera de vista.
				if (!("built" in c.unit.dataset)) done(c.unit);
				claimed.delete(c.unit);
			}
			c.unit = null;
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
			o: { dur?: number; bend?: number; each?: () => void } = {},
		): Task {
			const from = { x: c.x, y: c.y };
			const p0 = to();
			const d =
				o.dur ?? clamp(Math.hypot(p0.x - c.x, p0.y - c.y) / 1800, 0.18, 0.55);
			const bow = o.bend ?? rand(-0.12, 0.12);
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
				o.each?.();
			}
		}
		function* click(c: Cursor): Task {
			c.press = 1;
			yield* wait(0.06);
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
			while (t < 0.2) {
				t += yield;
				c.op = Math.max(0, 1 - t / 0.2);
			}
			c.ov = null;
			c.op = 1;
		}
		// Reposo: el cursor acompaña al viewport con algo de retraso al hacer
		// scroll. Con `eager`, lo interrumpe en cuanto aparece trabajo.
		function* rest(c: Cursor, s: number, eager: boolean): Task {
			let left = s;
			while (left > 0 && !(eager && free().length)) {
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

		// ── Construcción ──
		function* buildBox(c: Cursor, el: HTMLElement): Task {
			yield* moveTo(c, () => pageRect(el));
			yield* click(c);
			start(el, "inset(0 100% 100% 0)");
			const cut = () => {
				const b = pageRect(el);
				return {
					...b,
					w: clamp(c.x - b.x, 0, b.w),
					h: clamp(c.y - b.y, 0, b.h),
				};
			};
			const corner = () => {
				const b = pageRect(el);
				return {
					x: b.x + b.w,
					// Sin salir de pantalla: lo que quede debajo aparece al soltar.
					y: Math.min(b.y + b.h, window.scrollY + window.innerHeight - 24),
				};
			};
			c.ov = () => {
				const k = cut();
				return box(k, BLUE) + size(k);
			};
			yield* moveTo(c, corner, {
				dur: rand(0.25, 0.45),
				bend: rand(-0.04, 0.04),
				each: () => {
					const b = pageRect(el);
					const k = cut();
					el.style.clipPath = `inset(0px ${n(b.w - k.w)}px ${n(b.h - k.h)}px 0px)`;
				},
			});
			done(el);
			c.ov = () => {
				const b = pageRect(el);
				return box(b, BLUE, true) + size(b);
			};
			yield* hold(c, rand(0.2, 0.4), corner);
		}

		function* guide(c: Cursor, el: HTMLElement): Task {
			// Arrastra una guía desde la regla y la deja donde irá el elemento.
			const vertical = Math.random() < 0.5;
			const f = rand(0.2, 0.8);
			const edge = () =>
				vertical
					? {
							x: window.scrollX + f * window.innerWidth,
							y: window.scrollY + TOP + 6,
						}
					: {
							x: window.scrollX + 8,
							y: window.scrollY + f * window.innerHeight,
						};
			yield* moveTo(c, edge);
			yield* click(c);
			c.shape = vertical ? "ew" : "ns";
			const snapped = () => {
				const b = pageRect(el);
				return vertical
					? { x: b.x, y: window.scrollY + TOP + 6 }
					: { x: window.scrollX + 8, y: b.y };
			};
			let snap = false;
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
				return snap ? g + box(pageRect(el), RED) : g;
			};
			yield* moveTo(c, snapped, { dur: rand(0.25, 0.4), bend: 0 });
			snap = true;
			yield* hold(c, 0.2, snapped);
			yield* fade(c);
			c.shape = "arrow";
		}

		function* buildText(c: Cursor, el: HTMLElement): Task {
			c.shape = "ibeam";
			let p = 0;
			const at = () => sweep(textLines(el), p);
			yield* moveTo(c, () => at().end);
			yield* click(c);
			start(el, "inset(0 100% 100% 0)");
			c.ov = () => {
				const { end } = at();
				return (
					box(pageRect(el), BLUE) +
					line({ x: end.x, y: end.y - 9 }, { x: end.x, y: end.y + 9 }, BLUE)
				);
			};
			const total = textLines(el).reduce((s, l) => s + l.w, 0);
			const dur = clamp(total / 2200, 0.2, 0.8);
			let t = 0;
			while (t < dur) {
				t += yield;
				p = Math.min(1, t / dur);
				const { rects, end } = at();
				el.style.clipPath = staircase(pageRect(el), rects);
				Object.assign(c, end);
			}
			done(el);
			c.ov = () => box(pageRect(el), BLUE);
			yield* hold(c, rand(0.15, 0.3), () => at().end);
		}

		function* buildPen(c: Cursor, el: HTMLElement): Task {
			c.shape = "pen";
			start(el, "inset(50%)");
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
				yield* moveTo(c, () => corners()[i % 4], { bend: rand(-0.03, 0.03) });
				yield* click(c);
				if (i < 4) placed = i + 1;
				else closed = true;
			}
			// Trazado cerrado: el contenido se abre desde el centro.
			let t = 0;
			while (t < 0.25) {
				t += yield;
				el.style.clipPath = `inset(${n(50 * (1 - ease(Math.min(1, t / 0.25))))}%)`;
			}
			done(el);
			yield* hold(c, 0.2, () => corners()[0]);
		}

		function* build(c: Cursor, el: HTMLElement): Task {
			const kind = kindOf(el);
			if (kind === "pen") return yield* buildPen(c, el);
			if (kind === "box") return yield* buildBox(c, el);
			// Segunda pasada opcional: guía previa en los titulares.
			const g = el.matches("h1, h2") ? 0.7 : el.matches("h3") ? 0.25 : 0;
			if (Math.random() < g) yield* guide(c, el);
			yield* buildText(c, el);
		}

		function* life(c: Cursor, delay: number): Task {
			yield* rest(c, delay, false);
			for (;;) {
				const el = pick(c);
				if (el) {
					c.unit = el;
					claimed.add(el);
					yield* build(c, el);
					if (c.ov) yield* fade(c);
					release(c);
					yield* rest(c, rand(0.05, 0.2), false);
					continue;
				}
				// Nada que construir a la vista: esperar casi quieto al scroll.
				yield* rest(c, rand(1.5, 3), true);
				if (free().length) continue;
				const to = {
					x: clamp(
						c.x + rand(-120, 120),
						window.scrollX + 40,
						window.scrollX + window.innerWidth - 80,
					),
					y: clamp(
						c.y + rand(-80, 80),
						window.scrollY + TOP + 40,
						window.scrollY + window.innerHeight - 80,
					),
				};
				yield* moveTo(c, () => to, { dur: rand(0.9, 1.4) });
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
				unit: null,
				ov: null,
				gen: wait(0),
				root,
				svg: root.firstElementChild as SVGSVGElement,
			};
			c.gen = life(c, i * 0.12);
			return c;
		});

		let raf = 0;
		let last = performance.now();
		let lastScroll = window.scrollY;
		let vel = 0;
		let drawn = "";
		const tick = (now: number) => {
			// Pestaña en segundo plano: no recuperar el tiempo perdido de golpe.
			const dt = Math.min(0.05, (now - last) / 1000);
			last = now;
			clock = now / 1000;
			cache = null;
			const sx = window.scrollX;
			const sy = window.scrollY;
			// Más trabajo pendiente o scroll más rápido: trabajan más deprisa.
			const speed = Math.abs(sy - lastScroll) / Math.max(dt, 0.001);
			vel += (speed - vel) * Math.min(1, dt * 6);
			lastScroll = sy;
			const tempo = clamp(1 + free().length * 0.06 + vel / 1500, 1, 2.6);

			let next = "";
			for (const c of cursors) {
				// Su componente salió de pantalla al hacer scroll: soltarlo.
				if (c.unit && !inView(c.unit)) {
					release(c);
					c.gen = life(c, 0.05);
				}
				c.gen.next(dt * tempo);

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
			if (next !== drawn) {
				drawn = next;
				overlay.innerHTML = next;
			}
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);

		return () => {
			cancelAnimationFrame(raf);
			// Lo que estuviera a medio construir queda visible.
			for (const c of cursors) if (c.unit) done(c.unit);
			host.replaceChildren();
		};
	}, []);

	return <div ref={layer} className="builder-cursors" aria-hidden="true" />;
}
