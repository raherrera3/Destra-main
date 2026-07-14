"use client";
import CalendlyWidget from "@/components/meeting-section/CalendlyWidget";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight, CalendarDays, CheckCircle2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocale } from "./LocaleProvider";
import {
	type ContactRequest,
	createContactRequestSchema,
	needValues,
} from "./contactSchema";
import type { ContactErrorCode } from "./siteCopy";
function getCalendlyUrl() {
	const value = process.env.NEXT_PUBLIC_CALENDLY_URL?.trim();
	if (!value) return null;
	try {
		const url = new URL(value);
		return url.protocol === "https:" ? url.toString() : null;
	} catch {
		return null;
	}
}
const calendlyUrl = getCalendlyUrl();
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
	const { copy } = useLocale();
	const [sent, setSent] = useState(false);
	const [serverError, setServerError] = useState("");
	const summary = useRef<HTMLDivElement>(null);
	const startedAt = useRef(Date.now());
	const schema = useMemo(
		() => createContactRequestSchema(copy.form.validation),
		[copy],
	);
	const {
		register,
		handleSubmit,
		setValue,
		reset,
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
		},
	});
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
		try {
			const response = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
			});
			const payload = (await response.json().catch(() => null)) as {
				code?: ContactErrorCode;
			} | null;
			if (!response.ok)
				throw new Error(
					copy.form.errors[payload?.code ?? "unexpected_failure"],
				);
			setSent(true);
			reset();
			startedAt.current = Date.now();
		} catch (error) {
			setServerError(
				error instanceof Error
					? error.message
					: copy.form.errors.unexpected_failure,
			);
		}
	};
	const entries = Object.entries(errors).filter(
		([key]) => key !== "website" && key !== "startedAt",
	);
	const l = copy.form.labels;
	return (
		<section
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
						<form onSubmit={handleSubmit(submit)} noValidate>
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
									{serverError} {copy.form.retry}
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
										{...register("company")}
									/>
								</Field>
								<Field id="role" label={l.role} hint={copy.form.hints.role}>
									<input
										id="role"
										autoComplete="organization-title"
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
								<Field id="size" label={l.size}>
									<select id="size" {...register("size")}>
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
			<div className="container meeting-panel">
				<div className="meeting-copy">
					<CalendarDays aria-hidden />
					<h2>{copy.contact.meetingTitle}</h2>
					<p>{copy.contact.meetingLead}</p>
				</div>
				{calendlyUrl ? (
					<div className="calendly-shell">
						<CalendlyWidget url={calendlyUrl} />
					</div>
				) : (
					<div className="meeting-unavailable">
						<p>{copy.contact.unavailable}</p>
					</div>
				)}
			</div>
		</section>
	);
}
