"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import BrandLogo from "./BrandLogo";
import LanguageToggle from "./LanguageToggle";
import { useLocale } from "./LocaleProvider";

export default function SiteHeader() {
	const { copy } = useLocale();
	const [open, setOpen] = useState(false);
	const id = useId();
	const toggle = useRef<HTMLButtonElement>(null);
	const panel = useRef<HTMLDivElement>(null);
	const nav = [
		["#inicio", copy.navLabels.home],
		["#servicios", copy.navLabels.services],
		["#faq", copy.navLabels.faq],
	] as const;

	useEffect(() => {
		if (!open) return;
		const previous = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		const nodes = panel.current?.querySelectorAll<HTMLElement>(
			"a[href],button:not([disabled])",
		);
		nodes?.[0]?.focus();
		const onKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setOpen(false);
				return;
			}
			if (event.key !== "Tab" || !nodes?.length) return;
			const first = nodes[0];
			const last = nodes[nodes.length - 1];
			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		};
		document.addEventListener("keydown", onKey);
		return () => {
			document.body.style.overflow = previous;
			document.removeEventListener("keydown", onKey);
			toggle.current?.focus();
		};
	}, [open]);

	const close = () => setOpen(false);

	return (
		<header className="site-header" id="inicio">
			<div className="header-shell glass-surface">
				<Link
					className="brand"
					href="#inicio"
					aria-label={copy.header.home}
					onClick={close}
				>
					<BrandLogo
						surface="dark"
						priority
						sizes="(max-width: 768px) 132px, 152px"
					/>
				</Link>
				<nav className="desktop-nav" aria-label={copy.header.nav}>
					{nav.map(([href, label]) => (
						<Link key={href} href={href}>
							{label}
						</Link>
					))}
				</nav>
				<div className="header-actions">
					<LanguageToggle />
					<Link className="button button--primary header-cta" href="#contacto">
						{copy.header.cta}
					</Link>
				</div>
				<button
					ref={toggle}
					type="button"
					className="menu-toggle"
					aria-expanded={open}
					aria-controls={id}
					aria-label={open ? copy.header.close : copy.header.open}
					onClick={() => setOpen(!open)}
				>
					{open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
				</button>
			</div>
			<div
				id={id}
				ref={panel}
				className={`mobile-menu glass-surface${open ? " is-open" : ""}`}
				hidden={!open}
			>
				<nav aria-label={copy.header.mobileNav}>
					<LanguageToggle onChange={close} />
					{nav.map(([href, label]) => (
						<Link key={href} href={href} onClick={close}>
							{label}
						</Link>
					))}
					<Link
						className="button button--primary"
						href="#contacto"
						onClick={close}
					>
						{copy.header.cta}
					</Link>
				</nav>
			</div>
		</header>
	);
}
