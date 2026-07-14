import { z } from "zod";
export const needValues = [
	"strategy",
	"solution",
	"architecture",
	"integration",
	"private",
	"improve",
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
export function createContactRequestSchema(messages: Validation) {
	return z.object({
		name: z.string().trim().min(2, messages.name).max(120),
		email: z.string().trim().email(messages.email).max(180),
		company: z.string().trim().min(2, messages.company).max(180),
		role: z.string().trim().max(120).optional().default(""),
		need: z.enum(needValues, { required_error: messages.need }),
		size: z.string().trim().max(40).optional().default(""),
		context: z.string().trim().min(20, messages.context).max(3000),
		website: z.string().trim().max(500).optional().default(""),
		startedAt: z.number().int().positive(),
	});
}
export const contactRequestSchema = createContactRequestSchema({
	name: "Invalid name",
	email: "Invalid email",
	company: "Invalid organisation",
	need: "Invalid need",
	context: "Invalid context",
});
export type ContactRequest = z.infer<typeof contactRequestSchema>;
