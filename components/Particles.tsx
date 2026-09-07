"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import ParticlesCanvas from "react-particles";
import type { Engine, ISourceOptions } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";
export default function ParticlesBackground() {
	// Start with the standard experience. Starting in reduced mode meant the
	// canvas was initialised as static and, depending on the engine lifecycle,
	// could remain static after the media-query effect ran.
	const [reduced, setReduced] = useState(false);
	useEffect(() => {
		const media = window.matchMedia("(prefers-reduced-motion: reduce)");
		const update = () => setReduced(media.matches);
		update();
		media.addEventListener("change", update);
		return () => media.removeEventListener("change", update);
	}, []);
	const init = useCallback(async (engine: Engine) => {
		await loadSlim(engine);
	}, []);
	const options = useMemo<ISourceOptions>(
		() => ({
			fullScreen: { enable: false },
			fpsLimit: 30,
			particles: {
				color: { value: "#FFFBF9" },
				links: {
					enable: true,
					color: "#FFFBF9",
					distance: 165,
					opacity: 0.08,
					width: 1,
				},
				move: {
					enable: !reduced,
					direction: "none",
					outModes: { default: "out" },
					// Perceptible while scrolling, without becoming a distracting UI effect.
					speed: 0.3,
				},
				number: { density: { enable: true, area: 950 }, value: 38 },
				opacity: { value: { min: 0.1, max: 0.18 } },
				shape: { type: "circle" },
				size: { value: { min: 1.2, max: 2.15 } },
			},
			interactivity: {
				events: {
					onHover: { enable: !reduced, mode: "grab" },
					onClick: { enable: false },
				},
				modes: {
					grab: {
						distance: 140,
						links: { color: "#FFFBF9", opacity: 0.2 },
					},
				},
			},
			detectRetina: false,
		}),
		[reduced],
	);
	return (
		<ParticlesCanvas
			id="destra-atmosphere"
			init={init}
			options={options}
			className="absolute inset-0 h-full w-full pointer-events-none"
		/>
	);
}
