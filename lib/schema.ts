import { z } from 'zod'

export const CustomerSchema = z.object({
    store_id: z.number().gte(1).safe(), 
    first_name: z.string().regex(/^[a-zA-Z]+$/).min(1).max(45), 
    last_name: z.string().regex(/^[a-zA-Z]+$/).min(1).max(45), 
    email: z.string().email().min(3).max(45), 
    phone: z.string().regex(/^\d+$/).max(15), 
    address: z.string().regex(/^[a-zA-Z0-9 ,.\-]+$/).min(1).max(50), 
    address2: z.string().regex(/^[a-zA-Z0-9 ,.\-]+$/).min(1).max(50).optional(), 
    district: z.string().regex(/^[a-zA-Z]+$/).min(1).max(20), 
    city_id: z.number().gte(1).safe(),
    postal_code: z.string().min(4).max(10)
}).strict()