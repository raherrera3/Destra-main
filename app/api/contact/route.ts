import { contactRequestSchema } from "@/components/site/contactSchema";
import { NextResponse } from "next/server";

const windowMs = 10 * 60 * 1000;
const maxRequests = 5;

function getContactWebhook() {
	const configuredUrl = process.env.CONTACT_WEBHOOK_URL?.trim();
	if (!configuredUrl) return null;

	try {
		const url = new URL(configuredUrl);
		return url.protocol === "https:" ? url.toString() : null;
	} catch {
		return null;
	}
}

type RateState = { count: number; resetAt: number };
const globalRateStore = globalThis as typeof globalThis & {
	__destraContactRateStore?: Map<string, RateState>;
};
const rateStore =
	globalRateStore.__destraContactRateStore ?? new Map<string, RateState>();
globalRateStore.__destraContactRateStore = rateStore;

function isRateLimited(key: string) {
	const now = Date.now();
	const current = rateStore.get(key);
	if (!current || current.resetAt <= now) {
		rateStore.set(key, { count: 1, resetAt: now + windowMs });
		return false;
	}
	current.count += 1;
	return current.count > maxRequests;
}

export async function POST(request: Request) {
	const contentType = request.headers.get("content-type") ?? "";
	if (!contentType.includes("application/json")) {
		return NextResponse.json({ code: "invalid_content_type" }, { status: 415 });
	}

	const contactWebhook = getContactWebhook();
	if (!contactWebhook) {
		return NextResponse.json({ code: "not_configured" }, { status: 503 });
	}

	const clientKey =
		request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
	if (isRateLimited(clientKey)) {
		return NextResponse.json(
			{ code: "rate_limited" },
			{ status: 429, headers: { "Retry-After": "600" } },
		);
	}

	try {
		const body: unknown = await request.json();
		const parsed = contactRequestSchema.safeParse(body);
		if (!parsed.success) {
			return NextResponse.json({ code: "invalid_request" }, { status: 400 });
		}

		const values = parsed.data;
		if (values.website)
			return NextResponse.json({ data: "ok" }, { status: 200 });

		const elapsed = Date.now() - values.startedAt;
		if (elapsed < 1200 || elapsed > 2 * 60 * 60 * 1000) {
			return NextResponse.json({ code: "invalid_session" }, { status: 400 });
		}

		const [firstName, ...lastNameParts] = values.name.split(/\s+/);
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 12_000);
		let response: Response;

		try {
			response = await fetch(contactWebhook, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					"first-name": firstName,
					"last-name": lastNameParts.join(" "),
					email: values.email,
					"phone-number": "",
					message: values.context,
					company: values.company,
					role: values.role,
					need: values.need,
					size: values.size,
				}),
				signal: controller.signal,
				cache: "no-store",
			});
		} finally {
			clearTimeout(timeout);
		}

		if (!response.ok) {
			console.error("Contact webhook returned", response.status);
			return NextResponse.json({ code: "delivery_failed" }, { status: 502 });
		}

		const responseText = await response.text();
		if (!responseText.toLowerCase().includes("success")) {
			console.error("Contact webhook returned an unexpected response");
			return NextResponse.json({ code: "delivery_failed" }, { status: 502 });
		}

		return NextResponse.json({ data: "ok" }, { status: 200 });
	} catch (error) {
		console.error(
			"Contact request failed",
			error instanceof Error ? error.name : "UnknownError",
		);
		return NextResponse.json({ code: "unexpected_failure" }, { status: 500 });
	}
}
