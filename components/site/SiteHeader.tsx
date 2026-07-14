"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
	type KeyboardEvent as ReactKeyboardEvent,
	useEffect,
	useId,
	useRef,
	useState,
} from "react";
import LanguageToggle from "./LanguageToggle";
import { useLocale } from "./LocaleProvider";

export default function SiteHeader() {
	const { copy } = useLocale();
	const [open, setOpen] = useState(false);
	const [servicesOpen, setServicesOpen] = useState(false);
	const id = useId();
	const servicesId = useId();
	const toggle = useRef<HTMLButtonElement>(null);
	const panel = useRef<HTMLDivElement>(null);
	const servicesMenu = useRef<HTMLDivElement>(null);
	const servicesTrigger = useRef<HTMLButtonElement>(null);
	const nav = [
		["#ia-privada", copy.navLabels.private],
		["#metodo", copy.navLabels.method],
		["#casos-de-uso", copy.navLabels.cases],
		["#destra", copy.navLabels.why],
	] as const;
	const serviceLinks = copy.services.items.map((item) => ({
		href: `#servicio-${item.intent}`,
		title: item.title,
	}));

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

	useEffect(() => {
		if (!servicesOpen) return;
		const closeFromOutside = (event: PointerEvent) => {
			if (!servicesMenu.current?.contains(event.target as Node)) {
				setServicesOpen(false);
			}
		};
		const closeFromKeyboard = (event: KeyboardEvent) => {
			if (event.key !== "Escape") return;
			setServicesOpen(false);
			servicesTrigger.current?.focus();
		};
		document.addEventListener("pointerdown", closeFromOutside);
		document.addEventListener("keydown", closeFromKeyboard);
		return () => {
			document.removeEventListener("pointerdown", closeFromOutside);
			document.removeEventListener("keydown", closeFromKeyboard);
		};
	}, [servicesOpen]);

	const close = () => {
		setOpen(false);
		setServicesOpen(false);
	};
	const focusService = (position: "first" | "last") => {
		const links =
			servicesMenu.current?.querySelectorAll<HTMLAnchorElement>(
				"[role='menuitem']",
			);
		if (!links?.length) return;
		links[position === "first" ? 0 : links.length - 1].focus();
	};
	const onServicesTriggerKeyDown = (
		event: ReactKeyboardEvent<HTMLButtonElement>,
	) => {
		if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
		event.preventDefault();
		setServicesOpen(true);
		window.requestAnimationFrame(() =>
			focusService(event.key === "ArrowDown" ? "first" : "last"),
		);
	};

	return (
		<header className="site-header" id="inicio">
			<div className="header-shell glass-surface">
				<Link
					className="brand"
					href="#inicio"
					aria-label={copy.header.home}
					onClick={close}
				>
					<Image
						src="/destra-logo.png"
						alt="DESTRA"
						width={689}
						height={237}
						priority
						sizes="(max-width: 768px) 132px, 152px"
					/>
				</Link>
				<nav className="desktop-nav" aria-label={copy.header.nav}>
					<div className="services-menu" ref={servicesMenu}>
						<button
							ref={servicesTrigger}
							type="button"
							className="services-menu__trigger"
							aria-expanded={servicesOpen}
							aria-controls={servicesId}
							aria-haspopup="menu"
							onClick={() => setServicesOpen((value) => !value)}
							onKeyDown={onServicesTriggerKeyDown}
						>
							{copy.navLabels.services}
							<ChevronDown aria-hidden="true" />
						</button>
						<div
							id={servicesId}
							className="services-menu__panel glass-surface"
							role="menu"
							hidden={!servicesOpen}
							aria-label={copy.header.servicesMenu}
						>
							{serviceLinks.map((service) => (
								<Link
									key={service.href}
									href={service.href}
									role="menuitem"
									onClick={() => setServicesOpen(false)}
								>
									{service.title}
								</Link>
							))}
						</div>
					</div>
					{nav.map(([href, label]) => (
						<Link key={href} href={href} onClick={() => setServicesOpen(false)}>
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
					<Link
						className="mobile-services-heading"
						href="#servicios"
						onClick={close}
					>
						{copy.navLabels.services}
					</Link>
					<div className="mobile-service-links">
						{serviceLinks.map((service) => (
							<Link key={service.href} href={service.href} onClick={close}>
								{service.title}
							</Link>
						))}
					</div>
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
						{copy.hero.primary}
					</Link>
				</nav>
			</div>
		</header>
	);
}
