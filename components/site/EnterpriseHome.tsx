"use client";

import {
	ArrowDown,
	ArrowRight,
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
				<div className="container hero-copy">
					<p className="hero-kicker">{copy.hero.kicker}</p>
					<h1 id="hero-title">
						{accentWord(copy.hero.title, locale === "es" ? "IA" : "AI")}
					</h1>
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
			</section>

			<section
				className="section services"
				id="servicios"
				aria-labelledby="services-title"
			>
				<div className="container">
					<header className="section-heading section-heading--wide">
						<h2 id="services-title">
							<span className="accent-text">
								{copy.services.title}
							</span>
						</h2>
						<p>{copy.services.lead}</p>
					</header>
					<div className="service-list">
						{copy.services.items.map((item) => {
							const ServiceIcon = serviceIcons[item.intent];

							return (
								<article
									className="service-row"
									id={`servicio-${item.intent}`}
									key={item.title}
								>
									<h3>
										<span className="service-bullet" aria-hidden="true">
											<ServiceIcon />
										</span>
										{item.title}
									</h3>
									<div className="service-detail">
										<strong>{copy.services.labels.solution}</strong>
										<p>{item.body}</p>
									</div>
									<div className="service-detail">
										<strong>{copy.services.labels.audience}</strong>
										<p>{item.audience}</p>
									</div>
									<div className="service-detail service-detail--model">
										<strong>{copy.services.labels.model}</strong>
										<p>{item.model}</p>
									</div>
									<Link
										className="service-cta"
										href="#contacto"
										data-intent={item.intent}
									>
										{item.cta} <ArrowRight aria-hidden />
									</Link>
								</article>
							);
						})}
					</div>
				</div>
			</section>

			<section className="section faq" id="faq" aria-labelledby="faq-title">
				<div className="container faq-grid">
					<header className="section-heading">
						<h2 id="faq-title">
							{accentWord(
								copy.faq.title,
								locale === "es" ? "empezar" : "first",
							)}
						</h2>
					</header>
					<div className="faq-list">
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
