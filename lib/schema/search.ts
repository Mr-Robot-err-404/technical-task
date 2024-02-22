import { z } from 'zod'

export const SearchSchema = z.object({
    title: z.string().regex(/^[a-zA-Z0-9 ,.\-]+$/).min(1).max(50).optional(),
    length: z.string().regex(/^\d+$/).min(1).max(5).optional()
}).strict()