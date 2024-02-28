import { z } from 'zod'

export const CategorySchema = z
  .object({
    categoryName: z
      .string()
      .regex(/^[a-zA-Z]+$/)
      .min(1)
      .max(25),
  })
  .strict()
