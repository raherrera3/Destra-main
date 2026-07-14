"use client";
import Link from "next/link";
import { useLocale } from "./LocaleProvider";
export default function PrivateAISection() {
	const { copy } = useLocale();
	const p = copy.privateAi;
	return (
		<section
			className="private-ai"
			id="ia-privada"
			aria-labelledby="private-title"
		>
			<div className="container private-shell">
				<div className="private-copy">
					<h2 id="private-title">{p.title}</h2>
					<p className="private-lead">{p.lead}</p>
					<p>{p.sectors}</p>
					<ul className="benefit-list">
						{p.benefits.map((item, index) => (
							<li key={item.title}>
								<span aria-hidden>0{index + 1}</span>
								<div>
									<strong>{item.title}</strong>
									<p>{item.body}</p>
								</div>
							</li>
						))}
					</ul>
					<Link
						className="button button--light"
						href="#contacto"
						data-intent="private"
					>
						{p.cta} <span aria-hidden>↗</span>
					</Link>
				</div>
				<div className="private-visual" role="img" aria-label={p.visual}>
					<div className="perimeter-label">
						<span aria-hidden /> {p.perimeter}
					</div>
					<div className="private-flow">
						{p.nodes.map((node, index) => (
							<div
								className={`private-node${index === 1 ? " private-node--active" : ""}`}
								key={node}
							>
								<small>0{index + 1}</small>
								<strong>{node}</strong>
							</div>
						))}
					</div>
					<div className="monitor-bar">
						{p.monitor.map((item) => (
							<span key={item}>{item}</span>
						))}
					</div>
				</div>
				<aside className="private-note">
					<strong>{p.noteTitle}</strong>
					<p>{p.note}</p>
				</aside>
			</div>
		</section>
	);
}
