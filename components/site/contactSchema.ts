import { z } from "zod";
export const needValues = [
	"fde",
	"solution",
	"architecture",
	"private",
	"unclear",
] as const;
export type NeedValue = (typeof needValues)[number];
type Validation = {
	name: string;
	email: string;
	company: string;
	need: string;
	context: string;
};
export function createContactRequestSchema(
	messages: Validation,
	locale: "es" | "en" = "es",
) {
	const maximum = (length: number) =>
		locale === "es"
			? `Usa como máximo ${length} caracteres`
			: `Use no more than ${length} characters`;
	return z.object({
		name: z.string().trim().min(2, messages.name).max(120, maximum(120)),
		email: z.string().trim().email(messages.email).max(180, maximum(180)),
		company: z.string().trim().min(2, messages.company).max(180, maximum(180)),
		role: z.string().trim().max(120, maximum(120)).optional().default(""),
		need: z
			.array(z.enum(needValues))
			.min(1, messages.need)
			.max(needValues.length, messages.need),
		size: z.string().trim().max(40, maximum(40)).optional().default(""),
		context: z
			.string()
			.trim()
			.min(20, messages.context)
			.max(3000, maximum(3000)),
		website: z.string().trim().max(500).optional().default(""),
		startedAt: z.number().int().positive(),
		source: z
			.string()
			.max(500)
			.regex(/^\/(?!\/)[^\r\n?#\\]*$/)
			.optional()
			.default("/"),
		turnstileToken: z.string().max(2048).optional().default(""),
	});
}
export const contactAcknowledgmentSchema = z
	.object({
		success: z.literal(true),
		id: z.string().uuid(),
	})
	.strict();
export const contactRequestSchema = createContactRequestSchema({
	name: "Invalid name",
	email: "Invalid email",
	company: "Invalid organisation",
	need: "Invalid need",
	context: "Invalid context",
});
export type ContactRequest = z.infer<typeof contactRequestSchema>;
