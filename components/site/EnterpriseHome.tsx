"use client";

import {
	ArrowDown,
	ArrowUpRight,
	Blocks,
	Bot,
	CircleHelp,
	type LucideIcon,
	Network,
	Plus,
	ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import ContactExperience from "./ContactExperience";
import { useLocale } from "./LocaleProvider";
import type { NeedValue } from "./contactSchema";

function accentWord(text: string, word: string) {
	const index = text.indexOf(word);
	if (index < 0) return text;
	return (
		<>
			{text.slice(0, index)}
			<span className="accent-text">{word}</span>
			{text.slice(index + word.length)}
		</>
	);
}

// Logos en public/logos/<slug>.<ext>. Sin `logo`, se muestra el nombre en texto.
const clients: Array<{ name: string; logo?: string }> = [
	{ name: "Engel & Völkers", logo: "engel-volkers.svg" },
	{ name: "Ferlicom", logo: "ferlicom.png" },
	{ name: "CRUGA Rehabilita", logo: "cruga.png" },
	{ name: "Indy" },
	{ name: "Grup Capital", logo: "grup-capital.png" },
	{ name: "StratyaERP" },
	{ name: "Alcosmik", logo: "alcosmik.svg" },
	{ name: "Foimpex", logo: "foimpex.png" },
	{ name: "Larson Martin", logo: "larson-martin.png" },
];

const serviceIcons: Record<NeedValue, LucideIcon> = {
	fde: Bot,
	solution: Blocks,
	architecture: Network,
	private: ShieldCheck,
	unclear: CircleHelp,
};

export default function EnterpriseHome() {
	const { copy, locale } = useLocale();

	return (
		<>
			<section className="hero section" aria-labelledby="hero-title">
				<div className="hero-glow" aria-hidden="true" />
				<div className="container hero-grid">
					<p className="hero-kicker">
						<span className="hero-kicker__dot" aria-hidden="true" />
						{copy.hero.kicker}
					</p>
					<h1 id="hero-title">
						{accentWord(copy.hero.title, locale === "es" ? "IA" : "AI")}
					</h1>
					<div className="hero-aside">
						<p className="hero-lead">{copy.hero.lead}</p>
						<div className="button-group">
							<Link className="button button--primary" href="#contacto">
								{copy.hero.primary} <ArrowUpRight aria-hidden />
							</Link>
							<Link className="button button--secondary" href="#servicios">
								{copy.hero.secondary} <ArrowDown aria-hidden />
							</Link>
						</div>
						<p className="microcopy">{copy.hero.reassurance}</p>
					</div>
					<ul className="hero-facts">
						{copy.hero.facts.map((fact) => (
							<li key={fact.label}>
								<strong>{fact.value}</strong>
								<span>{fact.label}</span>
							</li>
						))}
					</ul>
				</div>
				<div className="clients">
					<p className="clients__title container">{copy.clients}</p>
					<div className="marquee">
						<ul className="marquee__track">
							{[...clients, ...clients].map((client, index) => (
								<li
									className="client"
									// biome-ignore lint/suspicious/noArrayIndexKey: lista estática duplicada a propósito para el bucle
									key={index}
									aria-hidden={index >= clients.length || undefined}
								>
									{client.logo ? (
										<img
											src={`/logos/${client.logo}`}
											alt={client.name}
											loading="lazy"
											height="56"
										/>
									) : (
										<span>{client.name}</span>
									)}
								</li>
							))}
						</ul>
					</div>
				</div>
			</section>

			<section
				className="section services"
				id="servicios"
				aria-labelledby="services-title"
			>
				<div className="container">
					<header className="section-heading section-heading--split reveal">
						<span className="section-index">01 — {copy.services.title}</span>
						<h2 id="services-title">{copy.services.headline}</h2>
						<p>{copy.services.lead}</p>
					</header>
					<div className="bento">
						{copy.services.items.map((item, index) => {
							const ServiceIcon = serviceIcons[item.intent];
							return (
								<article
									className="bento-card reveal"
									id={`servicio-${item.intent}`}
									key={item.title}
								>
									<div className="bento-card__top">
										<span className="bento-card__index">0{index + 1}</span>
										<span className="bento-card__icon" aria-hidden="true">
											<ServiceIcon />
										</span>
									</div>
									<h3>{item.title}</h3>
									<p className="bento-card__body">{item.body}</p>
									<dl className="bento-card__meta">
										<div>
											<dt>{copy.services.labels.audience}</dt>
											<dd>{item.audience}</dd>
										</div>
										<div>
											<dt>{copy.services.labels.model}</dt>
											<dd>{item.model}</dd>
										</div>
									</dl>
									<Link
										className="bento-card__cta"
										href="#contacto"
										data-intent={item.intent}
									>
										{item.cta} <ArrowUpRight aria-hidden />
									</Link>
								</article>
							);
						})}
					</div>
				</div>
			</section>

			<section
				className="section process"
				id="metodo"
				aria-labelledby="process-title"
			>
				<div className="container">
					<header className="section-heading section-heading--split reveal">
						<span className="section-index">02 — {copy.process.title}</span>
						<h2 id="process-title">{copy.process.headline}</h2>
						<p>{copy.process.lead}</p>
					</header>
					<ol className="process-steps">
						{copy.process.steps.map((step, index) => (
							<li className="reveal" key={step.title}>
								<span className="process-step__num" aria-hidden="true">
									0{index + 1}
								</span>
								<h3>{step.title}</h3>
								<p>{step.body}</p>
							</li>
						))}
					</ol>
				</div>
			</section>

			<section className="section faq" id="faq" aria-labelledby="faq-title">
				<div className="container faq-grid">
					<header className="section-heading reveal">
						<span className="section-index">03 — FAQ</span>
						<h2 id="faq-title">
							{accentWord(
								copy.faq.title,
								locale === "es" ? "empezar" : "first",
							)}
						</h2>
					</header>
					<div className="faq-list reveal">
						{copy.faq.items.map((item) => (
							<details key={item.title}>
								<summary>
									<span>{item.title}</span>
									<Plus aria-hidden />
								</summary>
								<p>{item.body}</p>
							</details>
						))}
					</div>
				</div>
			</section>

			<ContactExperience />
		</>
	);
}
