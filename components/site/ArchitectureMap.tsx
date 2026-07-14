"use client";
import { useLocale } from "./LocaleProvider";
export default function ArchitectureMap() {
	const { copy } = useLocale();
	const m = copy.map;
	return (
		<figure className="architecture-map" aria-labelledby="architecture-caption">
			<figcaption id="architecture-caption">{m.caption}</figcaption>
			<div className="architecture-stage">
				<div className="architecture-side architecture-side--sources">
					<span>{m.sources}</span>
					<ul>
						{m.sourceNodes.map((node) => (
							<li key={node}>{node}</li>
						))}
					</ul>
				</div>
				<div className="architecture-core">
					<span>{m.core}</span>
					<strong>{m.core}</strong>
					<ul>
						{m.coreItems.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
				</div>
				<div className="architecture-side architecture-side--outcomes">
					<span>{m.outcomes}</span>
					<ul>
						{m.outcomeNodes.map((node) => (
							<li key={node}>{node}</li>
						))}
					</ul>
				</div>
			</div>
			<div className="architecture-control">
				<span>{m.control}</span>
				<strong>{m.controlValues}</strong>
			</div>
		</figure>
	);
}
