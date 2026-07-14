"use client";
import Link from "next/link";
import { useLocale } from "./LocaleProvider";
export default function MethodAndProof() {
	const { copy } = useLocale();
	return (
		<>
			<section
				className="section method"
				id="metodo"
				aria-labelledby="method-title"
			>
				<div className="container method-grid">
					<header className="section-heading">
						<h2 id="method-title">{copy.method.title}</h2>
						<p>{copy.method.lead}</p>
						<Link className="text-link" href="#contacto" data-intent="unclear">
							{copy.method.cta} <span aria-hidden>→</span>
						</Link>
					</header>
					<ol className="method-list">
						{copy.method.steps.map((item, index) => (
							<li key={item.title}>
								<span>0{index + 1}</span>
								<div>
									<h3>{item.title}</h3>
									<p>{item.body}</p>
								</div>
							</li>
						))}
					</ol>
				</div>
			</section>
			<section
				className="section cases"
				id="casos-de-uso"
				aria-labelledby="cases-title"
			>
				<div className="container">
					<header className="section-heading section-heading--split">
						<div>
							<h2 id="cases-title">{copy.cases.title}</h2>
							<p>{copy.cases.lead}</p>
						</div>
						<small>{copy.cases.disclaimer}</small>
					</header>
					<div className="case-matrix">
						{copy.cases.items.map((item, index) => (
							<article className="case-item" key={item.title}>
								<span className="case-number">0{index + 1}</span>
								<div>
									<h3>{item.title}</h3>
									<p>{item.body}</p>
								</div>
								<Link href="#contacto" data-intent={item.intent}>
									{item.cta} <span aria-hidden>→</span>
								</Link>
							</article>
						))}
					</div>
				</div>
			</section>
			<section className="section why" id="destra" aria-labelledby="why-title">
				<div className="container">
					<header className="section-heading">
						<h2 id="why-title">{copy.why.title}</h2>
					</header>
					<div className="why-grid">
						{copy.why.items.map((item, index) => (
							<article key={item.title}>
								<span>0{index + 1}</span>
								<h3>{item.title}</h3>
								<p>{item.body}</p>
							</article>
						))}
					</div>
				</div>
			</section>
			<section className="section faq" aria-labelledby="faq-title">
				<div className="container faq-grid">
					<header className="section-heading">
						<h2 id="faq-title">{copy.faq.title}</h2>
					</header>
					<div className="faq-list">
						{copy.faq.items.map((item) => (
							<details key={item.title}>
								<summary>
									{item.title}
									<span aria-hidden>+</span>
								</summary>
								<p>{item.body}</p>
							</details>
						))}
					</div>
				</div>
			</section>
		</>
	);
}
