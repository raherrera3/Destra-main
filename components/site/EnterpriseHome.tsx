"use client";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import ArchitectureMap from "./ArchitectureMap";
import ContactExperience from "./ContactExperience";
import { useLocale } from "./LocaleProvider";
import MethodAndProof from "./MethodAndProof";
import PrivateAISection from "./PrivateAISection";
export default function EnterpriseHome() {
	const { copy } = useLocale();
	return (
		<>
			<section className="hero section" aria-labelledby="hero-title">
				<div className="hero-glow" aria-hidden="true" />
				<div className="container hero-copy">
					<p className="hero-kicker">{copy.hero.kicker}</p>
					<h1 id="hero-title">{copy.hero.title}</h1>
					<p className="hero-lead">{copy.hero.lead}</p>
					<div className="button-group">
						<Link className="button button--primary" href="#contacto">
							{copy.hero.primary} <ArrowUpRight aria-hidden />
						</Link>
						<Link className="button button--secondary" href="#metodo">
							{copy.hero.secondary} <ArrowDown aria-hidden />
						</Link>
					</div>
					<p className="microcopy">{copy.hero.reassurance}</p>
				</div>
				<div className="container hero-visual">
					<ArchitectureMap />
				</div>
				<div className="container capability-band" aria-label={copy.hero.band}>
					<p>{copy.hero.band}</p>
					<ul>
						{copy.hero.capabilities.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
				</div>
			</section>
			<section
				className="section problem"
				id="contexto"
				aria-labelledby="problem-title"
			>
				<div className="container problem-grid">
					<header className="section-heading">
						<h2 id="problem-title">{copy.problem.title}</h2>
						<p>{copy.problem.lead}</p>
					</header>
					<div className="problem-list">
						{copy.problem.items.map((item, index) => (
							<article key={item.title}>
								<span>0{index + 1}</span>
								<div>
									<h3>{item.title}</h3>
									<p>{item.body}</p>
								</div>
							</article>
						))}
					</div>
				</div>
				<div className="container statement">
					<p>{copy.problem.statement}</p>
					<strong>{copy.problem.emphasis}</strong>
				</div>
			</section>
			<section
				className="section connected-model"
				id="propuesta"
				aria-labelledby="proposal-title"
			>
				<div className="container">
					<header className="section-heading section-heading--wide">
						<h2 id="proposal-title">{copy.proposal.title}</h2>
						<p>{copy.proposal.lead}</p>
					</header>
					<div className="operating-model" aria-label={copy.proposal.title}>
						<div className="model-center">
							<span>DESTRA</span>
							<strong>{copy.proposal.center}</strong>
						</div>
						<ol>
							{copy.proposal.dimensions.map((item, index) => (
								<li key={item.title}>
									<span>0{index + 1}</span>
									<strong>{item.title}</strong>
									<small>{item.body}</small>
								</li>
							))}
						</ol>
					</div>
					<Link className="text-link" href="#metodo">
						{copy.proposal.cta} <ArrowRight aria-hidden />
					</Link>
				</div>
			</section>
			<section
				className="section services"
				id="servicios"
				aria-labelledby="services-title"
			>
				<div className="container">
					<header className="section-heading">
						<h2 id="services-title">{copy.services.title}</h2>
						<p>{copy.services.lead}</p>
					</header>
					<div className="service-list">
						{copy.services.items.map((item, index) => (
							<article
								className="service-row"
								id={`servicio-${item.intent}`}
								key={item.title}
							>
								<div className="service-index">
									<span>0{index + 1}</span>
									<small>{item.stage}</small>
								</div>
								<div>
									<h3>{item.title}</h3>
									<p>{item.body}</p>
									<Link href="#contacto" data-intent={item.intent}>
										{item.cta} <ArrowRight aria-hidden />
									</Link>
								</div>
								<ul className="service-tags">
									{item.tags.map((tag) => (
										<li key={tag}>{tag}</li>
									))}
								</ul>
							</article>
						))}
					</div>
				</div>
			</section>
			<PrivateAISection />
			<MethodAndProof />
			<ContactExperience />
		</>
	);
}
