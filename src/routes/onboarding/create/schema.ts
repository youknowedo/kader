import { z } from 'zod';
export const formSchema = z.object({
	name: z.string().min(1).max(255),
	school: z.string().min(1).max(255),
	city: z.string().min(1).max(255)
});
