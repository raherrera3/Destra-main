"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowUpRight, CheckCircle2, X } from "lucide-react";
import Script from "next/script";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocale } from "./LocaleProvider";
import {
	type ContactRequest,
	contactAcknowledgmentSchema,
	createContactRequestSchema,
	needValues,
} from "./contactSchema";
import type { ContactErrorCode } from "./siteCopy";

type Turnstile = {
	render: (
		element: HTMLElement,
		options: {
			sitekey: string;
			action: string;
			language: string;
			size: "flexible";
			callback: (token: string) => void;
			"expired-callback": () => void;
			"error-callback": () => void;
			"timeout-callback": () => void;
		},
	) => string;
	remove: (id: string) => void;
	reset: (id: string) => void;
};
declare global {
	interface Window {
		turnstile?: Turnstile;
	}
}
const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

function Field({
	id,
	label,
	hint,
	error,
	children,
	required,
}: {
	id: string;
	label: string;
	hint?: string;
	error?: string;
	children: React.ReactNode;
	required?: boolean;
}) {
	return (
		<label className="field" htmlFor={id}>
			<span>
				{label}
				{required && <em> *</em>}
			</span>
			{children}
			{hint && <small id={`${id}-hint`}>{hint}</small>}
			{error && (
				<small className="field-error" id={`${id}-error`}>
					{error}
				</small>
			)}
		</label>
	);
}
export default function ContactExperience() {
	const { copy, locale } = useLocale();
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [sent, setSent] = useState(false);
	const [serverError, setServerError] = useState("");
	const summary = useRef<HTMLDivElement>(null);
	const section = useRef<HTMLElement>(null);
	const verificationContainer = useRef<HTMLDivElement>(null);
	const widget = useRef<string | null>(null);
	const [verificationReady, setVerificationReady] = useState(false);
	const [verificationError, setVerificationError] = useState(false);
	const previousLocale = useRef(locale);
	const startedAt = useRef(Date.now());
	const glassFilterId = useId().replaceAll(":", "");
	const schema = useMemo(
		() => createContactRequestSchema(copy.form.validation, locale),
		[copy, locale],
	);
	const {
		register,
		handleSubmit,
		setValue,
		reset,
		trigger,
		formState: { errors, isSubmitting, submitCount },
	} = useForm<ContactRequest>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: "",
			email: "",
			company: "",
			role: "",
			need: undefined,
			size: "",
			context: "",
			website: "",
			startedAt: startedAt.current,
			source: "/",
			turnstileToken: "",
		},
	});
	useEffect(() => {
		if (!section.current) return;
		const sticky = document.querySelector<HTMLAnchorElement>(".mobile-cta");
		if (!sticky) return;
		if (!("IntersectionObserver" in window)) {
			sticky.hidden = true;
			return;
		}
		const observer = new IntersectionObserver(([entry]) => {
			sticky.hidden = entry.isIntersecting;
		});
		observer.observe(section.current);
		return () => {
			observer.disconnect();
			sticky.hidden = false;
		};
	}, []);
	useEffect(() => {
		if (previousLocale.current === locale) return;
		previousLocale.current = locale;
		if (submitCount) void trigger();
	}, [locale, submitCount, trigger]);
	useEffect(() => {
		const turnstile = window.turnstile;
		if (
			!verificationReady ||
			!drawerOpen ||
			!siteKey ||
			!turnstile ||
			!verificationContainer.current ||
			sent
		)
			return;
		setValue("turnstileToken", "");
		setVerificationError(false);
		try {
			widget.current = turnstile.render(verificationContainer.current, {
				sitekey: siteKey,
				action: "contact",
				language: locale,
				size: "flexible",
				callback: (token) => {
					setValue("turnstileToken", token);
					setVerificationError(false);
				},
				"expired-callback": () => {
					setValue("turnstileToken", "");
					setVerificationError(true);
				},
				"error-callback": () => {
					setValue("turnstileToken", "");
					setVerificationError(true);
				},
				"timeout-callback": () => {
					setValue("turnstileToken", "");
					setVerificationError(true);
				},
			});
		} catch {
			setVerificationError(true);
		}
		return () => {
			if (widget.current !== null) turnstile.remove(widget.current);
			widget.current = null;
			setValue("turnstileToken", "");
		};
	}, [verificationReady, drawerOpen, locale, sent, setValue]);
	useEffect(() => {
		const choose = (event: MouseEvent) => {
			const element = event.target as HTMLElement;
			const target = element.closest<HTMLElement>("[data-intent]");
			const intent = target?.dataset.intent as
				| ContactRequest["need"]
				| undefined;
			if (intent && needValues.includes(intent))
				setValue("need", intent, { shouldValidate: false });
			const opener = element.closest<HTMLElement>(
				'a[href="#contacto"], [data-contact-open]',
			);
			if (!opener) return;
			event.preventDefault();
			setDrawerOpen(true);
		};
		document.addEventListener("click", choose);
		if (window.location.hash === "#contacto") setDrawerOpen(true);
		return () => document.removeEventListener("click", choose);
	}, [setValue]);
	useEffect(() => {
		if (submitCount && Object.keys(errors).length) summary.current?.focus();
	}, [errors, submitCount]);
	const submit = async (values: ContactRequest) => {
		setServerError("");
		if (!siteKey) {
			setServerError(copy.form.errors.not_configured);
			return;
		}
		if (!values.turnstileToken) {
			setServerError(copy.form.errors.verification_failed);
			return;
		}
		try {
			const response = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ...values, source: window.location.pathname }),
				signal: AbortSignal.timeout(30_000),
				cache: "no-store",
			});
			const payload: unknown = await response.json().catch(() => null);
			const acknowledgment = contactAcknowledgmentSchema.safeParse(payload);
			if (!response.ok || !acknowledgment.success) {
				const code =
					payload &&
					typeof payload === "object" &&
					"code" in payload &&
					typeof payload.code === "string" &&
					Object.hasOwn(copy.form.errors, payload.code)
						? (payload.code as ContactErrorCode)
						: "delivery_failed";
				setServerError(copy.form.errors[code]);
				return;
			}
			setSent(true);
			startedAt.current = Date.now();
			reset({
				name: "",
				email: "",
				company: "",
				role: "",
				need: undefined,
				size: "",
				context: "",
				website: "",
				startedAt: startedAt.current,
				source: "/",
				turnstileToken: "",
			});
		} catch {
			setServerError(copy.form.errors.unexpected_failure);
		} finally {
			setValue("turnstileToken", "");
			if (widget.current !== null && window.turnstile)
				window.turnstile.reset(widget.current);
		}
	};
	const describedBy = (name: keyof ContactRequest, hint = false) =>
		[hint && `${name}-hint`, errors[name] && `${name}-error`]
			.filter(Boolean)
			.join(" ") || undefined;
	const entries = Object.entries(errors).filter(
		([key]) =>
			!["website", "startedAt", "source", "turnstileToken"].includes(key),
	);
	const l = copy.form.labels;
	return (
		<DialogPrimitive.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
			<section
				ref={section}
				className="contact section"
				id="contacto"
				aria-labelledby="contact-title"
			>
				<div className="container contact-intro">
					<div className="contact-copy">
						<span className="contact-eyebrow">{copy.contact.eyebrow}</span>
						<h2 id="contact-title">{copy.contact.title}</h2>
						<p>{copy.contact.lead}</p>
						<button
							className="button button--primary contact-open"
							type="button"
							data-contact-open
						>
							{copy.contact.open} <ArrowUpRight aria-hidden />
						</button>
					</div>
					<div className="contact-preview" aria-hidden="true">
						<span />
						<span />
						<span />
						<i />
					</div>
				</div>
			</section>

			<DialogPrimitive.Portal>
				<DialogPrimitive.Overlay className="contact-drawer-overlay" />
				<DialogPrimitive.Content
					className="contact-drawer"
					style={{
						backdropFilter: `url(#${glassFilterId}) blur(24px) saturate(155%)`,
					}}
				>
					<svg className="contact-drawer__filter" aria-hidden="true">
						<filter
							id={glassFilterId}
							x="-20%"
							y="-20%"
							width="140%"
							height="140%"
						>
							<feTurbulence
								type="fractalNoise"
								baseFrequency="0.008 0.015"
								numOctaves="2"
								seed="7"
								result="noise"
							/>
							<feGaussianBlur in="noise" stdDeviation="2" result="softNoise" />
							<feDisplacementMap
								in="SourceGraphic"
								in2="softNoise"
								scale="26"
								xChannelSelector="R"
								yChannelSelector="G"
							/>
						</filter>
					</svg>
					<div className="contact-drawer__shell">
						<DialogPrimitive.Close
							className="contact-drawer__close"
							aria-label={copy.contact.close}
						>
							<X aria-hidden />
						</DialogPrimitive.Close>
						<header className="contact-drawer__header">
							<span className="contact-eyebrow">{copy.contact.eyebrow}</span>
							<DialogPrimitive.Title className="contact-drawer__title">
								{copy.contact.title}
							</DialogPrimitive.Title>
							<DialogPrimitive.Description className="contact-drawer__lead">
								{copy.contact.lead}
							</DialogPrimitive.Description>
							<div className="next-step next-step--drawer">
								<strong>{copy.contact.includes}</strong>
								<ul>
									{copy.contact.points.map((point) => (
										<li key={point}>{point}</li>
									))}
								</ul>
							</div>
						</header>
						<div className="form-panel">
							{sent ? (
								<div className="form-success" aria-live="polite">
									<CheckCircle2 aria-hidden />
									<h3>{copy.contact.successTitle}</h3>
									<p>{copy.contact.success}</p>
									<button
										className="button button--secondary"
										type="button"
										onClick={() => setSent(false)}
									>
										{copy.contact.again}
									</button>
								</div>
							) : (
								<form
									onSubmit={handleSubmit(submit)}
									aria-busy={isSubmitting}
									noValidate
								>
									{entries.length > 0 && (
										<div
											className="error-summary"
											ref={summary}
											role="alert"
											tabIndex={-1}
										>
											<strong>{copy.form.errorSummary}</strong>
											<ul>
												{entries.map(([name, error]) => (
													<li key={name}>{error.message}</li>
												))}
											</ul>
										</div>
									)}
									{serverError && (
										<div className="server-error" role="alert">
											{serverError} {copy.form.retry}{" "}
											<a href="mailto:contacto@destra.es">contacto@destra.es</a>
										</div>
									)}
									<fieldset className="need-choice">
										<legend className="form-group-label">
											{l.need}{" "}
											<span className="form-group-label__hint">
												[{copy.form.placeholder}]
											</span>
										</legend>
										<div
											className="need-chips"
											aria-describedby={describedBy("need")}
										>
											{needValues.map((value) => (
												<span className="need-chip" key={value}>
													<input
														type="radio"
														id={`need-${value}`}
														value={value}
														aria-invalid={!!errors.need}
														{...register("need")}
													/>
													<label htmlFor={`need-${value}`}>
														<i className="need-chip__tick" />
														{copy.form.needs[value]}
													</label>
												</span>
											))}
										</div>
										{errors.need?.message && (
											<small className="field-error" id="need-error">
												{errors.need.message}
											</small>
										)}
									</fieldset>
									<p className="form-group-label">{copy.form.groups.about}</p>
									<div className="field-row">
										<Field
											id="name"
											label={l.name}
											required
											error={errors.name?.message}
										>
											<input
												id="name"
												autoComplete="name"
												aria-invalid={!!errors.name}
												aria-describedby={describedBy("name")}
												{...register("name")}
											/>
										</Field>
										<Field
											id="email"
											label={l.email}
											required
											error={errors.email?.message}
										>
											<input
												id="email"
												type="email"
												autoComplete="email"
												aria-invalid={!!errors.email}
												aria-describedby={describedBy("email")}
												{...register("email")}
											/>
										</Field>
									</div>
									<div className="field-row">
										<Field
											id="company"
											label={l.company}
											required
											error={errors.company?.message}
										>
											<input
												id="company"
												autoComplete="organization"
												aria-invalid={!!errors.company}
												aria-describedby={describedBy("company")}
												{...register("company")}
											/>
										</Field>
										<Field
											id="role"
											label={l.role}
											hint={copy.form.hints.role}
											error={errors.role?.message}
										>
											<input
												id="role"
												autoComplete="organization-title"
												aria-invalid={!!errors.role}
												aria-describedby={describedBy("role", true)}
												{...register("role")}
											/>
										</Field>
									</div>
									<p className="form-group-label">{copy.form.groups.project}</p>
									<div className="field-row">
										<Field
											id="size"
											label={l.size}
											error={errors.size?.message}
										>
											<select
												id="size"
												aria-invalid={!!errors.size}
												aria-describedby={describedBy("size")}
												{...register("size")}
											>
												{copy.form.sizes.map((value, index) => (
													<option key={value} value={index ? value : ""}>
														{value}
													</option>
												))}
											</select>
										</Field>
									</div>
									<Field
										id="context"
										label={l.context}
										required
										hint={copy.form.hints.context}
										error={errors.context?.message}
									>
										<textarea
											id="context"
											rows={5}
											aria-invalid={!!errors.context}
											aria-describedby={describedBy("context", true)}
											{...register("context")}
										/>
									</Field>
									<div className="honeypot" aria-hidden="true">
										<label>
											Website
											<input
												tabIndex={-1}
												autoComplete="off"
												{...register("website")}
											/>
										</label>
									</div>
									<input
										type="hidden"
										{...register("startedAt", { valueAsNumber: true })}
									/>
									{siteKey && (
										<>
											<Script
												src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
												strategy="afterInteractive"
												onReady={() => setVerificationReady(true)}
												onError={() => setVerificationError(true)}
											/>
											<div ref={verificationContainer} />
											{verificationError && (
												<p role="alert">
													{copy.form.errors.verification_failed}{" "}
													<a href="mailto:contacto@destra.es">
														contacto@destra.es
													</a>
												</p>
											)}
										</>
									)}
									<output aria-live="polite">
										{isSubmitting ? copy.form.sending : ""}
									</output>
									<button
										className="button button--primary form-submit"
										type="submit"
										disabled={isSubmitting}
									>
										{isSubmitting ? copy.form.sending : copy.form.submit}{" "}
										<ArrowUpRight aria-hidden />
									</button>
								</form>
							)}
						</div>
						<p className="privacy-note contact-drawer__privacy">
							{copy.contact.privacy}
						</p>
					</div>
				</DialogPrimitive.Content>
			</DialogPrimitive.Portal>
		</DialogPrimitive.Root>
	);
}
