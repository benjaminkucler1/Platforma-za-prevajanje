import { z } from 'zod';

export const zWordsSchema = z.object({
	words: z.array(
		z.object({
			id: z.number(),
			name: z.string(),
			value: z.string().optional(),
			fileId: z.number(),
			reviewRequired: z.boolean(),
			reviewed: z.boolean(),
			forbidden: z.boolean(),
			translation: z.string().optional()
		})
	)
});

export type ZWordsSchema = typeof zWordsSchema;
