"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import Script from "next/script";
import { useEffect, useMemo, useRef, useState } from "react";
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
	}, [verificationReady, locale, sent, setValue]);
	useEffect(() => {
		const choose = (event: MouseEvent) => {
			const target = (event.target as HTMLElement).closest<HTMLElement>(
				"[data-intent]",
			);
			const intent = target?.dataset.intent as
				| ContactRequest["need"]
				| undefined;
			if (intent && needValues.includes(intent))
				setValue("need", intent, { shouldValidate: false });
		};
		document.addEventListener("click", choose);
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
		<section
			ref={section}
			className="contact section"
			id="contacto"
			aria-labelledby="contact-title"
		>
			<div className="container contact-intro">
				<div className="contact-copy">
					<h2 id="contact-title">{copy.contact.title}</h2>
					<p>{copy.contact.lead}</p>
					<div className="next-step">
						<strong>{copy.contact.includes}</strong>
						<ul>
							{copy.contact.points.map((point) => (
								<li key={point}>{point}</li>
							))}
						</ul>
					</div>
					<p className="privacy-note">{copy.contact.privacy}</p>
				</div>
				<div className="form-panel glass-surface">
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
							<div className="field-row">
								<Field
									id="need"
									label={l.need}
									required
									error={errors.need?.message}
								>
									<select
										id="need"
										defaultValue=""
										aria-invalid={!!errors.need}
										aria-describedby={describedBy("need")}
										{...register("need")}
									>
										<option value="" disabled>
											{copy.form.placeholder}
										</option>
										{needValues.map((value) => (
											<option key={value} value={value}>
												{copy.form.needs[value]}
											</option>
										))}
									</select>
								</Field>
								<Field id="size" label={l.size} error={errors.size?.message}>
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
							{siteKey ? (
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
											<a href="mailto:contacto@destra.es">contacto@destra.es</a>
										</p>
									)}
								</>
							) : (
								<p role="alert">
									{copy.form.errors.not_configured}{" "}
									<a href="mailto:contacto@destra.es">contacto@destra.es</a>
								</p>
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
			</div>
		</section>
	);
}
