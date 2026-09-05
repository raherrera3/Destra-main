// Run: node --test tests/contact.test.cjs (no network or real environment values).
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
const id = "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794";
const configured = {
	RESEND_API_KEY: "test-only-key",
	CONTACT_FROM_EMAIL: "DESTRA <sender@example.com>",
	CONTACT_TO_EMAIL: "recipient@example.com",
	TURNSTILE_SECRET_KEY: "test-only-secret",
	NEXT_PUBLIC_TURNSTILE_SITE_KEY: "test-only-site-key",
	// Lets the regression exercise the old webhook implementation before the fix.
	CONTACT_WEBHOOK_URL: "https://legacy.example.com/contact",
};
const values = () => ({
	name: "Persona de Prueba",
	email: "lead@example.com",
	company: "Empresa de Prueba",
	role: "",
	need: "strategy",
	size: "",
	context: "Consulta de prueba con suficiente contexto.",
	website: "",
	startedAt: Date.now() - 5000,
	source: "/",
	turnstileToken: "test-only-token",
});
const json = (body, status = 200) => Response.json(body, { status });

function harness({
	env = configured,
	provider = () => json({ id }),
	verification = () =>
		json({ success: true, hostname: "www.destra.es", action: "contact" }),
	afterThrows = false,
} = {}) {
	const calls = [];
	const jobs = [];
	const logs = [];
	const modules = new Map();
	function load(file) {
		if (modules.has(file)) return modules.get(file).exports;
		const module = { exports: {} };
		modules.set(file, module);
		const source = ts.transpileModule(fs.readFileSync(file, "utf8"), {
			compilerOptions: {
				module: ts.ModuleKind.CommonJS,
				target: ts.ScriptTarget.ES2022,
			},
		}).outputText;
		vm.runInNewContext(
			source,
			{
				module,
				exports: module.exports,
				URL,
				URLSearchParams,
				Request,
				Response,
				Headers,
				AbortController,
				AbortSignal,
				setTimeout,
				clearTimeout,
				Date,
				process: { env: { ...env } },
				console: { error: (...args) => logs.push(args) },
				fetch: async (url, options) => {
					calls.push({ url: String(url), options });
					return String(url).includes("turnstile/v0/siteverify")
						? verification(url, options)
						: provider(url, options);
				},
				require(name) {
					if (name === "next/server")
						return {
							NextResponse: Response,
							after(job) {
								if (afterThrows) throw new Error("No request scope");
								jobs.push(job);
							},
						};
					if (name.startsWith("@/"))
						return load(`${path.join(root, name.slice(2))}.ts`);
					if (name.startsWith("."))
						return load(`${path.resolve(path.dirname(file), name)}.ts`);
					return require(name);
				},
			},
			{ filename: file },
		);
		return module.exports;
	}
	return {
		...load(path.join(root, "app/api/contact/route.ts")),
		calls,
		jobs,
		logs,
		schema: load(path.join(root, "components/site/contactSchema.ts")),
	};
}
const request = (body = values(), contentType = "application/json") =>
	new Request("https://www.destra.es/api/contact", {
		method: "POST",
		headers: { "Content-Type": contentType, "CF-Connecting-IP": "192.0.2.1" },
		body: typeof body === "string" ? body : JSON.stringify(body),
	});
async function expectError(response, status, code) {
	assert.equal(response.status, status);
	assert.match(response.headers.get("cache-control") || "", /no-store/);
	const body = await response.json();
	assert.equal(body.code, code);
	assert.notEqual(body.success, true);
}

test("validates fields and malformed JSON BEFORE missing configuration; every error is no-store", async () => {
	const h = harness({ env: {} });
	await expectError(
		await h.POST(request({ ...values(), email: "not-an-email" })),
		400,
		"invalid_request",
	);
	await expectError(await h.POST(request("{broken")), 400, "invalid_request");
	await expectError(
		await h.POST(request("x", "text/plain")),
		415,
		"invalid_content_type",
	);
	await expectError(await h.POST(request()), 503, "not_configured");
	assert.equal(h.calls.length, 0);
});

for (const [name, payload] of Object.entries({
	false: { success: false },
	unsuccessful: "unsuccessful",
	successText: "success",
	null: null,
	array: [],
	emptyId: { id: "" },
	badId: { id: "not-an-id" },
	falseWithId: { id, success: false },
	errorWithId: { id, error: "unsuccessful" },
})) {
	test(`rejects provider HTTP 200 with ${name}, never false success`, async () => {
		const h = harness({ provider: () => json(payload) });
		await expectError(await h.POST(request()), 502, "delivery_failed");
		assert.equal(h.jobs.length, 0);
	});
}
test("rejects malformed provider JSON, HTTP errors, and network timeout", async () => {
	for (const provider of [
		() => new Response("not-json"),
		() => json({ id }, 500),
		() => {
			throw new DOMException("Timed out", "TimeoutError");
		},
	]) {
		await expectError(
			await harness({ provider }).POST(request()),
			502,
			"delivery_failed",
		);
	}
});
test("awaits provider acknowledgment and sends all lead fields, source/date and Reply-To", async () => {
	let release;
	const h = harness({
		provider: () =>
			new Promise((resolve) => {
				release = () => resolve(json({ id }));
			}),
	});
	let settled = false;
	const sending = h.POST(request()).then((response) => {
		settled = true;
		return response;
	});
	await new Promise((resolve) => setTimeout(resolve, 20));
	assert.equal(settled, false);
	assert.equal(typeof release, "function");
	release();
	const response = await sending;
	assert.equal(response.status, 200);
	assert.match(response.headers.get("cache-control"), /no-store/);
	assert.deepEqual(await response.json(), { success: true, id });
	const mail = h.calls.find(
		(call) => call.url === "https://api.resend.com/emails",
	);
	assert.ok(mail);
	const payload = JSON.parse(mail.options.body);
	assert.equal(payload.from, configured.CONTACT_FROM_EMAIL);
	assert.deepEqual(payload.to, [configured.CONTACT_TO_EMAIL]);
	assert.equal(payload.reply_to, "lead@example.com");
	for (const text of [
		"Persona de Prueba",
		"Empresa de Prueba",
		"lead@example.com",
		"strategy",
		"Consulta de prueba",
		"Cargo: (vacío)",
		"Tamaño: (vacío)",
		"https://www.destra.es/",
	])
		assert.ok(payload.text.includes(text), text);
	assert.match(payload.text, /\d{4}-\d{2}-\d{2}T/);
	assert.ok(!payload.text.includes("test-only-token"));
	assert.ok(mail.options.signal);
	assert.equal(mail.options.cache, "no-store");
	assert.equal(h.jobs.length, 0);
});
test("Turnstile requires literal success, contact action and an authorized hostname", async () => {
	for (const verification of [
		() => json({ success: false }),
		() =>
			json({ success: "true", hostname: "www.destra.es", action: "contact" }),
		() => json({ success: true, hostname: "evil.example", action: "contact" }),
		() => json({ success: true, hostname: "destra.es", action: "login" }),
	]) {
		const h = harness({ verification });
		await expectError(await h.POST(request()), 400, "verification_failed");
		assert.equal(
			h.calls.filter((call) => call.url.includes("resend.com")).length,
			0,
		);
	}
	for (const verification of [
		() => json({}, 500),
		() => new Response("invalid-json"),
		() => {
			throw new Error("offline");
		},
	]) {
		await expectError(
			await harness({ verification }).POST(request()),
			502,
			"verification_unavailable",
		);
	}
});
test("honeypot, timing and blank Turnstile token fail without sending", async () => {
	for (const patch of [
		{ website: "spam" },
		{ startedAt: Date.now() + 60_000 },
		{ startedAt: Date.now() - 3 * 60 * 60_000 },
	]) {
		const h = harness();
		const response = await h.POST(request({ ...values(), ...patch }));
		assert.equal(response.status, 400);
		assert.match(response.headers.get("cache-control"), /no-store/);
		assert.equal(h.calls.length, 0);
	}
	const h = harness();
	await expectError(
		await h.POST(request({ ...values(), turnstileToken: "" })),
		400,
		"verification_failed",
	);
	assert.equal(h.calls.length, 0);
});
test("sixth attempt from an IP is rate limited", async () => {
	const h = harness();
	for (let i = 0; i < 5; i++)
		assert.equal((await h.POST(request())).status, 200);
	const response = await h.POST(request());
	await expectError(response, 429, "rate_limited");
	assert.equal(response.headers.get("retry-after"), "600");
});

test("invalid requests consume the IP limit before JSON parsing", async () => {
	const h = harness();
	for (let i = 0; i < 5; i++) {
		await expectError(await h.POST(request("{broken")), 400, "invalid_request");
	}
	const blocked = request("{broken");
	blocked.json = () => { throw new Error("Rate-limited body must not be parsed"); };
	await expectError(await h.POST(blocked), 429, "rate_limited");
	assert.equal(h.calls.length, 0);
});

test("body limit is 16KiB of actual streamed bytes even with a false Content-Length", async () => {
	const h = harness();
	let cancelled = false;
	const input = JSON.stringify({ ...values(), ignored: "x".repeat(40_000) });
	let offset = 0;
	const stream = new ReadableStream({
		pull(controller) {
			if (offset >= input.length) { controller.close(); return; }
			controller.enqueue(new TextEncoder().encode(input.slice(offset, offset + 4096)));
			offset += 4096;
		},
		cancel() { cancelled = true; },
	});
	const oversized = new Request("https://www.destra.es/api/contact", {
		method: "POST", duplex: "half", body: stream,
		headers: { "Content-Type": "application/json", "Content-Length": "1", "CF-Connecting-IP": "192.0.2.1" },
	});
	await expectError(await h.POST(oversized), 413, "request_too_large");
	assert.equal(cancelled, true);
	assert.equal(h.calls.length, 0);
	// Exact boundary passes; one more byte fails. Count bytes, not JS characters.
	const valid = JSON.stringify(values());
	assert.equal((await h.POST(request(valid + " ".repeat(16384 - Buffer.byteLength(valid))))).status, 200);
	await expectError(await h.POST(request(valid + " ".repeat(16385 - Buffer.byteLength(valid)))), 413, "request_too_large");
	await expectError(await h.POST(request({ ...values(), ignored: "漢".repeat(6000) })), 413, "request_too_large");
});
test("optional CRM is scheduled after success only; failures never change the response", async () => {
	const env = {
		...configured,
		CRM_WEBHOOK_URL: "https://crm.example.com/hook",
	};
	const h = harness({
		env,
		provider: (url) =>
			String(url).includes("crm.example")
				? Promise.reject(new Error("CRM offline"))
				: json({ id }),
	});
	const response = await h.POST(request());
	assert.equal(response.status, 200);
	assert.equal(h.jobs.length, 1);
	assert.equal(h.calls.length, 2); // Verification + email; CRM has not run.
	await h.jobs[0]();
	assert.deepEqual(await response.json(), { success: true, id });
	const crm = h.calls[2];
	assert.equal(crm.url, env.CRM_WEBHOOK_URL);
	assert.ok(crm.options.signal);
	assert.ok(!crm.options.body.includes("test-only-token"));
	const failure = harness({ env, provider: () => json({ success: false }) });
	assert.equal((await failure.POST(request())).status, 502);
	assert.equal(failure.jobs.length, 0);
	const invalid = harness({
		env: { ...env, CRM_WEBHOOK_URL: "http://crm.example.com/hook" },
	});
	assert.equal((await invalid.POST(request())).status, 200);
	assert.equal(invalid.jobs.length, 0);
	assert.equal(
		(await harness({ env, afterThrows: true }).POST(request())).status,
		200,
	);
});
test("client acknowledgment is typed, and enum/max-length validation stays localized", () => {
	const { schema } = harness();
	for (const locale of ["es", "en"]) {
		const messages = {
			name: `name-${locale}`,
			email: `email-${locale}`,
			company: `company-${locale}`,
			need: `need-${locale}`,
			context: `context-${locale}`,
		};
		const result = schema
			.createContactRequestSchema(messages, locale)
			.safeParse({
				...values(),
				need: "",
				name: "x".repeat(121),
				role: "x".repeat(121),
			});
		assert.equal(result.success, false);
		assert.equal(
			result.error.issues.find((issue) => issue.path[0] === "need").message,
			messages.need,
		);
		const limit = result.error.issues.find(
			(issue) => issue.path[0] === "role",
		).message;
		assert.match(limit, locale === "es" ? /caracteres/ : /characters/);
	}
	assert.equal(
		schema.contactAcknowledgmentSchema.safeParse({ success: true, id }).success,
		true,
	);
	for (const payload of [
		{ data: "ok" },
		{ success: false, id },
		{ success: true, id: "" },
		{ success: true, id, error: "unsuccessful" },
	])
		assert.equal(
			schema.contactAcknowledgmentSchema.safeParse(payload).success,
			false,
		);
});

test("form associates every field error/hint, validates acknowledgments and exposes fallback/status", () => {
	const source = fs.readFileSync(
		path.join(root, "components/site/ContactExperience.tsx"),
		"utf8",
	);
	// Source contracts complement the real schema/handler tests; browser geometry is checked separately.
	for (const field of [
		"name",
		"email",
		"company",
		"role",
		"need",
		"size",
		"context",
	]) {
		assert.match(
			source,
			new RegExp(`aria-describedby=\\{describedBy\\("${field}"`),
			field,
		);
	}
	assert.match(source, /contactAcknowledgmentSchema\.safeParse/);
	assert.match(source, /mailto:contacto@destra\.es/);
	assert.match(source, /aria-busy=\{isSubmitting\}/);
	assert.match(source, /<output aria-live="polite"/);
	assert.match(source, /turnstile\.reset/);
	assert.match(source, /new IntersectionObserver/);
	assert.match(
		fs.readFileSync(path.join(root, "app/globals.css"), "utf8"),
		/\.mobile-cta\[hidden\]\s*\{\s*display:\s*none/,
	);
});

test("contact opens as an accessible liquid-glass drawer with resilient fallbacks", () => {
	const source = fs.readFileSync(
		path.join(root, "components/site/ContactExperience.tsx"),
		"utf8",
	);
	const globals = fs.readFileSync(path.join(root, "app/globals.css"), "utf8");
	const copy = fs.readFileSync(
		path.join(root, "components/site/siteCopy.ts"),
		"utf8",
	);
	assert.match(source, /@radix-ui\/react-dialog/);
	assert.match(source, /a\[href=["']#contacto["']\]/);
	assert.match(source, /DialogPrimitive\.Content/);
	assert.match(source, /feDisplacementMap/);
	assert.match(globals, /\.contact-drawer/);
	assert.match(globals, /prefers-reduced-transparency:\s*reduce/);
	assert.match(copy, /cta:\s*"Contacto"/);
	assert.match(copy, /title:\s*"Hablemos"/);
});
