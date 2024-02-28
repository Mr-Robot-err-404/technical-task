import { db } from '../db'

export async function getCategoryID(categoryName: string) {
  return await db.selectFrom('category').where('name', 'ilike', categoryName).select('category_id').executeTakeFirst()
}
