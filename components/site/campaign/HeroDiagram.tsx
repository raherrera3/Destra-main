import { Isotipo } from "../BrandLogo";
import type { HeroDiagramContent } from "./content/types";
import { rich } from "./rich";

// Diagramas decorativos del hero (solo escritorio). Siguen al tema porque
// dibujan con los roles de color de la hoja, no con colores fijos.
const CENTER = 170;
const RING = 118;

function Orbit({ nodes }: { nodes: string[] }) {
	const points = nodes.map((label, index) => {
		const angle = -Math.PI / 2 + (index * 2 * Math.PI) / nodes.length;
		const at = (radius: number) => ({
			x: +(CENTER + radius * Math.cos(angle)).toFixed(1),
			y: +(CENTER + radius * Math.sin(angle)).toFixed(1),
		});
		return {
			label,
			node: at(RING),
			from: at(46),
			to: at(RING - 14),
			below: Math.sin(angle) > 0.01,
		};
	});
	return (
		<div className="campaign-orbit">
			<svg
				viewBox="0 0 340 340"
				fill="none"
				aria-hidden="true"
				focusable="false"
			>
				<circle cx={CENTER} cy={CENTER} r="166" stroke="var(--line)" />
				<circle cx={CENTER} cy={CENTER} r="72" stroke="var(--line)" />
				<circle
					cx={CENTER}
					cy={CENTER}
					r={RING}
					stroke="var(--accent)"
					strokeOpacity=".55"
					strokeDasharray="2 5"
				/>
				{points.map((point) => (
					<g key={point.label}>
						<line
							x1={point.from.x}
							y1={point.from.y}
							x2={point.to.x}
							y2={point.to.y}
							stroke="var(--accent)"
							strokeOpacity=".55"
							strokeDasharray="2 4"
						/>
						<circle
							cx={point.node.x}
							cy={point.node.y}
							r="14"
							fill="var(--bg)"
							stroke="var(--accent)"
							strokeWidth="1.5"
						/>
						<text
							x={point.node.x}
							y={point.below ? point.node.y + 30 : point.node.y - 22}
							textAnchor="middle"
							fill="var(--ink-soft)"
						>
							{point.label}
						</text>
					</g>
				))}
				<circle
					cx={CENTER}
					cy={CENTER}
					r="46"
					fill="var(--bg)"
					stroke="var(--accent)"
					strokeWidth="1.5"
				/>
			</svg>
			<Isotipo className="campaign-orbit__logo" />
		</div>
	);
}

function Connectors({ count }: { count: number }) {
	return (
		<div className="campaign-platform__links">
			{Array.from({ length: count }, (_, index) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: líneas decorativas idénticas
				<span key={index} />
			))}
		</div>
	);
}

function Platform({
	source,
	label,
	title,
	systems,
	caption,
}: Extract<HeroDiagramContent, { kind: "platform" }>) {
	return (
		<div className="campaign-platform">
			<div className="campaign-platform__source">
				<div>
					<span>{source}</span>
					<i />
					<i />
				</div>
				<b />
			</div>
			<Connectors count={3} />
			<div className="campaign-platform__core">
				<span>{label}</span>
				<strong>{rich(title)}</strong>
			</div>
			<Connectors count={4} />
			<div className="campaign-platform__systems">
				{systems.map((system) => (
					<span key={system}>{system}</span>
				))}
			</div>
			<span className="campaign-platform__caption">{caption}</span>
		</div>
	);
}

export default function HeroDiagram({
	diagram,
}: { diagram: HeroDiagramContent }) {
	return (
		<div className="campaign-diagram" aria-hidden="true">
			{diagram.kind === "orbit" ? (
				<Orbit nodes={diagram.nodes} />
			) : (
				<Platform {...diagram} />
			)}
		</div>
	);
}
