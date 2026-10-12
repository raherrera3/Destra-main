"use client";

import { ArrowUpRight, Plus } from "lucide-react";
import Link from "next/link";
import { Isotipo } from "./BrandLogo";
import ContactExperience from "./ContactExperience";
import { useLocale } from "./LocaleProvider";

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

function Eyebrow({ index, children }: { index: string; children: string }) {
	return (
		<p className="eyebrow">
			<b>{index}.</b>
			<span>{children}</span>
		</p>
	);
}

// Logos en public/logos/<slug>.<ext>. Sin `logo`, se muestra el nombre en texto.
const clients: Array<{ name: string; logo?: string }> = [
	{ name: "Engel & Völkers", logo: "engel-volkers.svg" },
	{ name: "Ferlicom", logo: "ferlicom.png" },
	{ name: "CRUGA Rehabilita", logo: "cruga.png" },
	{ name: "Indy", logo: "indy.png" },
	{ name: "Grup Capital", logo: "grup-capital.png" },
	{ name: "StratyaERP", logo: "stratya.png" },
	{ name: "Alcosmik", logo: "alcosmik.svg" },
	{ name: "Foimpex", logo: "foimpex.png" },
	{ name: "Larson Martin", logo: "larson-martin.png" },
];

// Un fondo de la paleta por servicio, como la página «Fondos» del manual.
const tileTones = ["electric", "deep", "sky", "night"] as const;

export default function EnterpriseHome() {
	const { copy, locale } = useLocale();

	return (
		<>
			<section
				className="hero section band band--night"
				aria-labelledby="hero-title"
			>
				<div className="container hero-grid">
					<div className="hero-copy">
						<p className="eyebrow">
							<b className="chev" aria-hidden="true" />
							<span>{copy.hero.kicker}</span>
						</p>
						<h1 id="hero-title">
							{accentWord(copy.hero.title, copy.hero.titleAccent)}
						</h1>
						<p className="hero-lead">{copy.hero.lead}</p>
						<div className="button-group">
							<Link className="button button--primary" href="#contacto">
								{copy.hero.primary}
								<span className="button__icon">
									<ArrowUpRight aria-hidden />
								</span>
							</Link>
							<Link className="button button--secondary" href="#servicios">
								{copy.hero.secondary}
							</Link>
						</div>
						<p className="microcopy">{copy.hero.reassurance}</p>
					</div>
					<div className="hero-mark">
						<Isotipo className="hero-iso" />
					</div>
				</div>
				<ul className="container hero-facts">
					{copy.hero.facts.map((fact) => (
						<li key={fact.label}>
							<strong>{fact.value}</strong>
							<span>{fact.label}</span>
						</li>
					))}
				</ul>
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
											height="52"
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
				className="section manifesto band band--deep"
				aria-labelledby="manifesto-title"
			>
				<div className="container manifesto-grid">
					<Eyebrow index="01">{copy.manifesto.label}</Eyebrow>
					<div className="reveal">
						<h2 id="manifesto-title">
							{accentWord(copy.manifesto.title, copy.manifesto.titleAccent)}
							<span className="chev" aria-hidden="true" />
						</h2>
						<div className="manifesto-body">
							<p>{copy.manifesto.body}</p>
							<ul className="values">
								{copy.manifesto.values.map((value) => (
									<li key={value}>{value}</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			</section>

			<section
				className="section services band band--paper"
				id="servicios"
				aria-labelledby="services-title"
			>
				<div className="container">
					<header className="section-heading section-heading--split reveal">
						<Eyebrow index="02">{copy.services.title}</Eyebrow>
						<h2 id="services-title">{copy.services.headline}</h2>
						<p>{copy.services.lead}</p>
					</header>
					<div className="tiles">
						{copy.services.items.map((item, index) => (
							<article
								className={`tile band band--${tileTones[index]} reveal`}
								id={`servicio-${item.intent}`}
								key={item.title}
							>
								<div className="tile__top">
									<span>0{index + 1}</span>
									<span className="chev" aria-hidden="true" />
								</div>
								<h3>{item.title}</h3>
								<p className="tile__body">{item.body}</p>
								<dl className="tile__meta">
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
									className="tile__cta"
									href="#contacto"
									data-intent={item.intent}
								>
									{item.cta}
									<span>
										<ArrowUpRight aria-hidden />
									</span>
								</Link>
							</article>
						))}
					</div>
				</div>
			</section>

			<section
				className="section process band band--ice"
				id="metodo"
				aria-labelledby="process-title"
			>
				<div className="container">
					<header className="section-heading section-heading--split reveal">
						<Eyebrow index="03">{copy.process.title}</Eyebrow>
						<h2 id="process-title">{copy.process.headline}</h2>
						<p>{copy.process.lead}</p>
					</header>
					<ol className="steps">
						{copy.process.steps.map((step, index) => (
							<li className="reveal" key={step.title}>
								<span className="step__num" aria-hidden="true">
									0{index + 1}
								</span>
								<h3>{step.title}</h3>
								<p>{step.body}</p>
							</li>
						))}
					</ol>
				</div>
			</section>

			<section
				className="section faq band band--snow"
				id="faq"
				aria-labelledby="faq-title"
			>
				<div className="container faq-grid">
					<header className="section-heading reveal">
						<Eyebrow index="04">FAQ</Eyebrow>
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
