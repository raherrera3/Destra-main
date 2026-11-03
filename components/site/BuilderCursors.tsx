"use client";
import { useEffect, useRef } from "react";

// Adaptación ligera de github.com/califa/swarm-site: unos pocos cursores
// "construyen" elementos reales de la página trazando una selección sobre ellos.
// Todo es decorativo (aria-hidden, sin eventos de puntero) y se anima fuera de
// React, escribiendo transform/estilos directamente en rAF.

const CURSORS = [
	{ name: "Ada", color: "#F24E1E" },
	{ name: "Linus", color: "#A259FF" },
	{ name: "Grace", color: "#0ACF83" },
	{ name: "Alan", color: "#FF7262" },
	{ name: "Hedy", color: "#1ABCFE" },
	{ name: "Ken", color: "#FFC700" },
];

const TARGETS =
	"main h1, main h2, main h3, main p, main .button, main .tile, main li";
const ARROW =
	"M4.6 3.9 C4.2 3.1 4.9 2.4 5.7 2.8 L20.6 9.4 C21.5 9.8 21.4 11.1 20.4 11.3 L13.9 12.9 C13.4 13 13 13.4 12.9 13.9 L11.3 20.4 C11.1 21.4 9.8 21.5 9.4 20.6 Z";

type Pt = { x: number; y: number };
type Phase = "rest" | "move" | "press" | "drag" | "hold" | "fade";
type Cursor = {
	x: number;
	y: number;
	phase: Phase;
	t: number;
	dur: number;
	from: Pt;
	bend: number;
	target: Element | null;
	root: HTMLDivElement;
	arrow: SVGSVGElement;
	box: HTMLDivElement;
	badge: HTMLSpanElement;
};

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const ease = (t: number) =>
	t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;

// Rectángulo del elemento en coordenadas de documento, para que cursores y
// selecciones se desplacen con el contenido al hacer scroll.
function pageRect(el: Element) {
	const r = el.getBoundingClientRect();
	return {
		x: r.left + window.scrollX,
		y: r.top + window.scrollY,
		w: r.width,
		h: r.height,
	};
}

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

		const claimed = new Set<Element>();
		const cursors: Cursor[] = CURSORS.map(({ name, color }, i) => {
			const root = document.createElement("div");
			root.className = "builder-cursor";
			root.innerHTML = `<svg width="28" height="28" viewBox="0 0 28 28"><path d="${ARROW}" fill="${color}" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></svg><span class="builder-cursor__label" style="background:${color}">${name}</span>`;
			const box = document.createElement("div");
			box.className = "builder-box";
			box.innerHTML =
				'<i></i><i></i><i></i><i></i><span class="builder-box__badge"></span>';
			host.append(box, root);
			// Entran escalonados desde los laterales.
			const left = i % 2 === 0;
			const x = left ? -40 : window.innerWidth + 40;
			const y = window.scrollY + rand(0.25, 0.75) * window.innerHeight;
			return {
				x,
				y,
				phase: "rest",
				t: 0,
				dur: 0.4 + i * 0.5,
				from: { x, y },
				bend: 0,
				target: null,
				root,
				arrow: root.firstElementChild as SVGSVGElement,
				box,
				badge: box.lastElementChild as HTMLSpanElement,
			};
		});

		const pick = (c: Cursor) => {
			const top = 90;
			const bottom = window.innerHeight - 30;
			const free = [...document.querySelectorAll(TARGETS)].filter((el) => {
				if (claimed.has(el) || el.closest(".marquee")) return false;
				const r = el.getBoundingClientRect();
				return (
					r.width > 40 &&
					r.height > 14 &&
					r.width < window.innerWidth * 0.8 &&
					r.top > top &&
					r.bottom < bottom
				);
			});
			// Preferir lo cercano: menos recorrido, menos ruido visual.
			free.sort((a, b) => {
				const ra = pageRect(a);
				const rb = pageRect(b);
				return (
					Math.hypot(ra.x - c.x, ra.y - c.y) -
					Math.hypot(rb.x - c.x, rb.y - c.y)
				);
			});
			return free[Math.floor(Math.random() * Math.min(4, free.length))] ?? null;
		};

		const go = (c: Cursor, phase: Phase, dur: number) => {
			c.phase = phase;
			c.t = 0;
			c.dur = dur;
			c.from = { x: c.x, y: c.y };
		};

		const step = (c: Cursor, dt: number) => {
			c.t += dt;
			const k = Math.min(1, c.t / c.dur);
			const r = c.target ? pageRect(c.target) : null;

			switch (c.phase) {
				case "rest":
					if (k < 1) break;
					c.target = pick(c);
					if (!c.target) {
						go(c, "rest", rand(0.6, 1.2));
						break;
					}
					claimed.add(c.target);
					{
						const t = pageRect(c.target);
						const d = Math.hypot(t.x - c.x, t.y - c.y);
						go(c, "move", Math.min(1.5, Math.max(0.6, d / 800)));
						c.bend = rand(-0.12, 0.12);
					}
					break;
				case "move":
				case "drag": {
					if (!r) break;
					const to =
						c.phase === "move"
							? { x: r.x, y: r.y }
							: { x: r.x + r.w, y: r.y + r.h };
					const e = ease(k);
					// Arco suave perpendicular al trayecto, como un pulso humano.
					const dx = to.x - c.from.x;
					const dy = to.y - c.from.y;
					const arc = Math.sin(Math.PI * e) * c.bend;
					c.x = c.from.x + dx * e - dy * arc;
					c.y = c.from.y + dy * e + dx * arc;
					if (k >= 1 && c.phase === "move") go(c, "press", 0.12);
					else if (k >= 1) go(c, "hold", rand(0.8, 1.4));
					break;
				}
				case "press":
					if (k >= 1) {
						go(c, "drag", rand(0.5, 0.9));
						c.bend = rand(-0.04, 0.04);
					}
					break;
				case "hold":
					if (r) {
						c.x = r.x + r.w;
						c.y = r.y + r.h;
					}
					if (k >= 1) go(c, "fade", 0.35);
					break;
				case "fade":
					if (k >= 1) {
						if (c.target) claimed.delete(c.target);
						c.target = null;
						go(c, "rest", rand(1, 2.8));
					}
					break;
			}
		};

		const paint = (c: Cursor) => {
			const sy = window.scrollY;
			const press = c.phase === "press" || c.phase === "drag" ? 0.88 : 1;
			c.root.style.transform = `translate(${c.x - window.scrollX}px, ${c.y - sy}px)`;
			c.arrow.style.transform = `translate(-5px, -3.5px) scale(${press})`;

			const r = c.target ? pageRect(c.target) : null;
			const show = r && ["drag", "hold", "fade"].includes(c.phase);
			if (!r || !show) {
				c.box.style.opacity = "0";
				return;
			}
			const w = c.phase === "drag" ? Math.max(0, c.x - r.x) : r.w;
			const h = c.phase === "drag" ? Math.max(0, c.y - r.y) : r.h;
			c.box.style.opacity =
				c.phase === "fade" ? String(1 - Math.min(1, c.t / c.dur)) : "1";
			c.box.style.transform = `translate(${r.x - window.scrollX}px, ${r.y - sy}px)`;
			c.box.style.width = `${w}px`;
			c.box.style.height = `${h}px`;
			c.box.dataset.done = c.phase === "drag" ? "" : "1";
			c.badge.textContent = `${Math.round(w)} × ${Math.round(h)}`;
		};

		let raf = 0;
		let last = performance.now();
		const tick = (now: number) => {
			// Pestaña en segundo plano: no recuperar el tiempo perdido de golpe.
			const dt = Math.min(0.05, (now - last) / 1000);
			last = now;
			for (const c of cursors) {
				step(c, dt);
				paint(c);
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
