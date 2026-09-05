import { contactRequestSchema } from "@/components/site/contactSchema";
import type { ContactErrorCode } from "@/components/site/siteCopy";
import { siteUrl } from "@/lib/site";
import { NextResponse, after } from "next/server";
import { z } from "zod";

const windowMs = 10 * 60 * 1000;
const maxRequests = 5;
const resendAcknowledgment = z.object({ id: z.string().uuid() }).strict();
type ResendAcknowledgment = z.infer<typeof resendAcknowledgment>;
const turnstileAcknowledgment = z.object({
	success: z.literal(true),
	hostname: z.string(),
	action: z.literal("contact"),
});
const hostname = new URL(siteUrl).hostname;
const allowedHostnames = new Set([hostname, hostname.replace(/^www\./, "")]);

function failure(
	code: ContactErrorCode,
	status: number,
	headers: Record<string, string> = {},
) {
	return NextResponse.json(
		{ code },
		{ status, headers: { ...headers, "Cache-Control": "no-store" } },
	);
}
function httpsUrl(value: string | undefined) {
	try {
		const url = new URL(value?.trim() ?? "");
		return url.protocol === "https:" && !url.username && !url.password
			? url.toString()
			: null;
	} catch {
		return null;
	}
}
function senderIsValid(value: string) {
	if (/[\r\n]/.test(value)) return false;
	const address = value.match(/^[^<>]+<([^<>]+)>$/)?.[1] ?? value;
	return z.string().email().safeParse(address.trim()).success;
}

type RateState = { count: number; resetAt: number };
const globalRateStore = globalThis as typeof globalThis & {
	__destraContactRateStore?: Map<string, RateState>;
};
const rateStore =
	globalRateStore.__destraContactRateStore ?? new Map<string, RateState>();
globalRateStore.__destraContactRateStore = rateStore;
// ponytail: per-process limit capped at 10k IPs; use a shared store if scaled to multiple replicas.
function isRateLimited(key: string) {
	const now = Date.now();
	for (const [ip, state] of rateStore)
		if (state.resetAt <= now) rateStore.delete(ip);
	const current = rateStore.get(key);
	if (!current) {
		if (rateStore.size >= 10_000) return true;
		rateStore.set(key, { count: 1, resetAt: now + windowMs });
		return false;
	}
	current.count += 1;
	return current.count > maxRequests;
}

export async function POST(request: Request) {
	// The trusted reverse proxy must overwrite these headers, not forward arbitrary client values.
	const clientKey =
		request.headers.get("cf-connecting-ip")?.trim() ||
		request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
		"local";
	if (isRateLimited(clientKey))
		return failure("rate_limited", 429, { "Retry-After": "600" });


	if (
		!(request.headers.get("content-type") ?? "")
			.toLowerCase()
			.startsWith("application/json")
	) {
		return failure("invalid_content_type", 415);
	}
	let body: unknown;
	try {
		const reader = request.body?.getReader();
		if (!reader) return failure("invalid_request", 400);
		const bytes = new Uint8Array(16 * 1024);
		let length = 0;
		while (true) {
			const chunk = await reader.read();
			if (chunk.done) break;
			if (length + chunk.value.byteLength > bytes.byteLength) {
				await reader.cancel();
				return failure("request_too_large", 413);
			}
			bytes.set(chunk.value, length);
			length += chunk.value.byteLength;
		}
		body = await new Response(bytes.slice(0, length)).json();
	} catch {
		return failure("invalid_request", 400);
	}
	const parsed = contactRequestSchema.safeParse(body);
	if (!parsed.success) return failure("invalid_request", 400);
	const values = parsed.data;
	if (values.website) return failure("invalid_request", 400);
	const elapsed = Date.now() - values.startedAt;
	if (elapsed < 1200 || elapsed > 2 * 60 * 60 * 1000)
		return failure("invalid_session", 400);


	const key = process.env.RESEND_API_KEY?.trim();
	const from = process.env.CONTACT_FROM_EMAIL?.trim();
	const to = process.env.CONTACT_TO_EMAIL?.trim();
	const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
	if (
		!key ||
		!from ||
		!senderIsValid(from) ||
		!to ||
		!z.string().email().safeParse(to).success ||
		!secret ||
		!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim()
	) {
		return failure("not_configured", 503);
	}
	if (!values.turnstileToken) return failure("verification_failed", 400);

	try {
		const response = await fetch(
			"https://challenges.cloudflare.com/turnstile/v0/siteverify",
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ secret, response: values.turnstileToken }),
				signal: AbortSignal.timeout(10_000),
				cache: "no-store",
				redirect: "error",
			},
		);
		if (!response.ok) return failure("verification_unavailable", 502);
		const verification = turnstileAcknowledgment.safeParse(
			await response.json(),
		);
		if (
			!verification.success ||
			!allowedHostnames.has(verification.data.hostname)
		) {
			return failure("verification_failed", 400);
		}
	} catch {
		return failure("verification_unavailable", 502);
	}

	const lead = {
		name: values.name,
		email: values.email,
		company: values.company,
		role: values.role,
		need: values.need,
		size: values.size,
		context: values.context,
		submittedAt: new Date().toISOString(),
		source: new URL(values.source, siteUrl).toString(),
	};
	const text = [
		`Nombre: ${lead.name}`,
		`Correo: ${lead.email}`,
		`Empresa: ${lead.company}`,
		`Cargo: ${lead.role || "(vacío)"}`,
		`Necesidad: ${lead.need}`,
		`Tamaño: ${lead.size || "(vacío)"}`,
		`Contexto: ${lead.context}`,
		`Fecha (UTC): ${lead.submittedAt}`,
		`Página de origen: ${lead.source}`,
	].join("\n");
	let acknowledgment: ResendAcknowledgment;
	try {
		const response = await fetch("https://api.resend.com/emails", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${key}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				from,
				to: [to],
				reply_to: lead.email,
				subject: `Estudio sin compromiso — ${lead.company.replace(/[\r\n]+/g, " ")} — ${lead.need}`,
				text,
			}),
			signal: AbortSignal.timeout(12_000),
			cache: "no-store",
			redirect: "error",
		});
		if (!response.ok) {
			console.error("Contact email provider HTTP error", response.status);
			return failure("delivery_failed", 502);
		}
		const result = resendAcknowledgment.safeParse(await response.json());
		if (!result.success) return failure("delivery_failed", 502);
		acknowledgment = result.data;
	} catch {
		return failure("delivery_failed", 502);
	}

	const crm = httpsUrl(process.env.CRM_WEBHOOK_URL);
	if (crm) {
		try {
			after(async () => {
				try {
					const response = await fetch(crm, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ ...lead, emailId: acknowledgment.id }),
						signal: AbortSignal.timeout(5000),
						cache: "no-store",
						redirect: "error",
					});
					if (!response.ok)
						console.error("Optional contact CRM HTTP error", response.status);
				} catch {
					console.error("Optional contact CRM delivery failed");
				}
			});
		} catch {
			console.error("Optional contact CRM could not be scheduled");
		}
	} else if (process.env.CRM_WEBHOOK_URL) {
		console.error(
			"Optional contact CRM URL must use HTTPS without credentials",
		);
	}
	// Provider acceptance is not proof of inbox delivery.
	return NextResponse.json(
		{ success: true, id: acknowledgment.id },
		{ headers: { "Cache-Control": "no-store" } },
	);
}
