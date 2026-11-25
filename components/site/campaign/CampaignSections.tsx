import { ArrowDown, ArrowUpRight, Plus } from "lucide-react";
import Link from "next/link";
import { Isotipo } from "../BrandLogo";
import ClientMarquee from "../ClientMarquee";
import HeroDiagram from "./HeroDiagram";
import type {
	Block,
	CampaignCommon,
	DeliverablesBlock,
	HeroBlock,
	HowBlock,
	ProblemBlock,
	ProtocolContent,
} from "./content/types";
import { rich } from "./rich";

// Secciones de las landings con las clases del sistema de la web. Los cursores
// construyen lo que coincide con KINDS (BuilderCursors.tsx); lo marcado con
// data-built se ve desde el primer pintado para no retrasar el LCP.

function Heading({
	id,
	label,
	title,
	sub,
}: { id: string; label: string; title: string; sub?: string }) {
	return (
		<header className="section-heading section-heading--wide reveal">
			<span className="section-index">{label}</span>
			<h2 id={id}>{rich(title)}</h2>
			{sub && <p>{sub}</p>}
		</header>
	);
}

function Panel({ label, text }: { label: string; text: string }) {
	return (
		<aside className="tile band band--service campaign-panel reveal">
			<span className="section-index">{label}</span>
			<p>{rich(text)}</p>
		</aside>
	);
}

function NumberedCards({ cards }: { cards: string[] }) {
	return (
		<div
			className={`tiles campaign-grid campaign-grid--${cards.length === 4 ? 4 : 3}`}
		>
			{cards.map((card, index) => (
				<article className="tile campaign-card reveal" key={card}>
					<div className="tile__top">
						<span>0{index + 1}</span>
						<Isotipo className="tile__iso" />
					</div>
					<p>{card}</p>
				</article>
			))}
		</div>
	);
}

function Hero({
	block,
	cta,
	clients,
}: { block: HeroBlock; cta: string; clients: string }) {
	return (
		<section
			className={`hero section campaign-hero${block.diagram ? " campaign-hero--diagram" : ""}`}
			aria-labelledby="hero-title"
		>
			<div className="hero-glow" aria-hidden="true" />
			<div className="container hero-grid">
				<p className="hero-kicker" data-built>
					{block.eyebrow}
				</p>
				<h1 id="hero-title" data-built>
					{rich(block.title)}
				</h1>
				{block.diagram && <HeroDiagram diagram={block.diagram} />}
				<div className="hero-aside">
					<p className="hero-lead" data-built>
						{block.lede}
					</p>
					<div className="button-group">
						<Link
							className="button button--primary"
							href="#contacto"
							data-built
						>
							{block.cta ?? cta} <ArrowUpRight aria-hidden />
						</Link>
						<Link
							className="button button--secondary"
							href={block.secondary.href}
							data-built
						>
							{block.secondary.label} <ArrowDown aria-hidden />
						</Link>
					</div>
					<p className="microcopy" data-built>
						{block.note}
					</p>
				</div>
				<ul className="hero-facts">
					{block.stats.map((stat) => (
						<li key={stat.label}>
							<strong>{stat.value}</strong>
							<span>{stat.label}</span>
						</li>
					))}
				</ul>
			</div>
			<ClientMarquee title={clients} />
		</section>
	);
}

function Problem({ block }: { block: ProblemBlock }) {
	return (
		<section className="section" id="problema" aria-labelledby="problema-title">
			<div className="container">
				<Heading id="problema-title" label={block.label} title={block.title} />
				<NumberedCards cards={block.cards} />
				<Panel label={block.panelLabel} text={block.panel} />
			</div>
		</section>
	);
}

function How({ block }: { block: HowBlock }) {
	return (
		<section
			className="section process"
			id="metodo"
			aria-labelledby="metodo-title"
		>
			<div className="container">
				<Heading id="metodo-title" label={block.label} title={block.title} />
				<ol className="process-steps campaign-steps campaign-steps--4">
					{block.steps.map((step, index) => (
						<li className="reveal" key={step.title}>
							<span className="process-step__num" aria-hidden="true">
								0{index + 1}
							</span>
							<h3>{step.title}</h3>
							<p>{step.text}</p>
						</li>
					))}
				</ol>
			</div>
		</section>
	);
}

function Deliverables({ block }: { block: DeliverablesBlock }) {
	return (
		<section
			className="section"
			id="que-recibes"
			aria-labelledby="que-recibes-title"
		>
			<div className="container">
				<Heading
					id="que-recibes-title"
					label={block.label}
					title={block.title}
				/>
				{block.variant === "hours" ? (
					<>
						<div className="tiles campaign-grid campaign-grid--2">
							{block.hours.map((hour) => (
								<article className="tile campaign-card reveal" key={hour.label}>
									<strong className="campaign-hour">{hour.value}</strong>
									<p>{hour.label}</p>
								</article>
							))}
						</div>
						<div className="tiles campaign-grid campaign-grid--3 campaign-grid--joined">
							{block.deliveries.map((delivery) => (
								<article
									className="tile campaign-card reveal"
									key={delivery.title}
								>
									<span className="section-index">{delivery.label}</span>
									<h3>{delivery.title}</h3>
									<p>{delivery.text}</p>
								</article>
							))}
						</div>
					</>
				) : (
					<>
						<NumberedCards cards={block.cards} />
						<Panel label={block.panelLabel} text={block.panel} />
					</>
				)}
			</div>
		</section>
	);
}

function Protocol({ content, cta }: { content: ProtocolContent; cta: string }) {
	return (
		<section
			className="section band band--deep campaign-protocol"
			id="protocolo"
			aria-labelledby="protocolo-title"
		>
			<div className="container">
				<Heading
					id="protocolo-title"
					label={content.label}
					title={content.title}
					sub={content.sub}
				/>
				<div className="campaign-tracks" aria-hidden="true">
					<span>{content.trackA}</span>
					<span>{content.trackB}</span>
				</div>
				<ol className="process-steps campaign-steps campaign-steps--5">
					{content.steps.map((step) => (
						<li
							className={`reveal${step.final ? " campaign-step--final" : ""}`}
							key={step.n}
						>
							<span className="process-step__num">{step.n}</span>
							<h3>{step.title}</h3>
							<p>{step.text}</p>
						</li>
					))}
				</ol>
				<aside className="tile band band--electric campaign-panel reveal">
					<span className="section-index">{content.ruleLabel}</span>
					<p>{rich(content.rule)}</p>
				</aside>
				<div className="button-group">
					<Link className="button button--primary" href="#contacto">
						{cta} <ArrowUpRight aria-hidden />
					</Link>
				</div>
			</div>
		</section>
	);
}

function Faq({ content }: { content: CampaignCommon["faq"] }) {
	return (
		<section
			className="section faq"
			id="preguntas"
			aria-labelledby="preguntas-title"
		>
			<div className="container faq-grid">
				<header className="section-heading reveal">
					<span className="section-index">{content.label}</span>
					<h2 id="preguntas-title">{rich(content.title)}</h2>
				</header>
				<div className="faq-list reveal">
					{content.items.map((item) => (
						<details key={item.q}>
							<summary>
								<span>{item.q}</span>
								<Plus aria-hidden />
							</summary>
							<p>{item.a}</p>
						</details>
					))}
				</div>
			</div>
		</section>
	);
}

function Closing({ statement }: { statement: string }) {
	return (
		<section className="section campaign-closing" aria-labelledby="cierre">
			<div className="container">
				<h2 id="cierre" className="reveal">
					{rich(statement)}
				</h2>
			</div>
		</section>
	);
}

export default function CampaignBlock({
	block,
	common,
	clients,
}: { block: Block; common: CampaignCommon; clients: string }) {
	switch (block.type) {
		case "hero":
			return <Hero block={block} cta={common.cta} clients={clients} />;
		case "problem":
			return <Problem block={block} />;
		case "how":
			return <How block={block} />;
		case "deliverables":
			return <Deliverables block={block} />;
		case "protocol5d":
			return <Protocol content={common.protocol} cta={common.cta} />;
		case "faq":
			return <Faq content={common.faq} />;
		case "closing":
			return <Closing statement={common.closing} />;
	}
}
