import { z } from 'zod';

export const createSchema = z.object({
	name: z.string().min(1).max(255),
	price: z.number().min(0),
	currency: z.string().length(3),
	periodMonth: z.number().min(1).max(12),
	periodDay: z.number().min(1).max(31)
});

export type CreateSchema = typeof createSchema;
