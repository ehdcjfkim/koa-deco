import z from "zod";

const file = z.object({
	fieldname: z.string(),
	originalname: z.string(),
	encoding: z.string(),
	mimetype: z.string(),
	destination: z.string(),
	filename: z.string(),
	path: z.string(),
	size: z.string(),
});

export type FileType = z.infer<typeof file>;
