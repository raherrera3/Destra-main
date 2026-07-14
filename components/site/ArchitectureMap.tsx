"use client";
import {
	ChartNoAxesColumnIncreasing,
	Crosshair,
	Database,
	FileText,
	Link2,
	Network,
	PanelsTopLeft,
	Settings2,
	ShieldCheck,
	UsersRound,
} from "lucide-react";
import { useLocale } from "./LocaleProvider";

const sourceIcons = [Database, FileText, ChartNoAxesColumnIncreasing];
const outcomeIcons = [UsersRound, Settings2, PanelsTopLeft];
const coreIcons = [Crosshair, Network, Link2];

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
						{m.sourceNodes.map((node, index) => {
							const Icon = sourceIcons[index];
							return (
								<li className="architecture-node" key={node}>
									<Icon aria-hidden="true" size={21} strokeWidth={1.75} />
									<span>{node}</span>
									<span className="architecture-node__connector" />
								</li>
							);
						})}
					</ul>
				</div>
				<div className="architecture-core">
					<span>{m.core}</span>
					<strong>{m.core}</strong>
					<ul>
						{m.coreItems.map((item, index) => {
							const Icon = coreIcons[index];
							return (
								<li key={item}>
									<Icon aria-hidden="true" size={15} strokeWidth={2} />
									<span>{item}</span>
								</li>
							);
						})}
					</ul>
				</div>
				<div className="architecture-side architecture-side--outcomes">
					<span>{m.outcomes}</span>
					<ul>
						{m.outcomeNodes.map((node, index) => {
							const Icon = outcomeIcons[index];
							return (
								<li className="architecture-node" key={node}>
									<span className="architecture-node__connector" />
									<Icon aria-hidden="true" size={21} strokeWidth={1.75} />
									<span>{node}</span>
								</li>
							);
						})}
					</ul>
				</div>
			</div>
			<div className="architecture-control">
				<span>
					<ShieldCheck aria-hidden="true" size={20} strokeWidth={1.8} />
					{m.control}
				</span>
				<strong>{m.controlValues}</strong>
			</div>
		</figure>
	);
}
