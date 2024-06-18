import { z } from 'zod';

export const editFormSchema = z.object({
	id: z.string(),
	name: z.string().min(1).max(255),
	price: z.number().min(0),
	currency: z.string().length(3),
	periodMonth: z.number().min(1).max(12),
	periodDay: z.number().min(1).max(31)
});

export type EditFormSchema = typeof editFormSchema;

export const createFormSchema = z.object({
	name: z.string().min(1).max(255),
	price: z.number().min(0),
	currency: z.string().length(3),
	periodMonth: z.number().min(1).max(12),
	periodDay: z.number().min(1).max(31)
});

export type CreateFormSchema = typeof createFormSchema;

export const deleteFormSchema = z.object({
	id: z.string()
});

export type DeleteFormSchema = typeof deleteFormSchema;
