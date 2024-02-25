import { db } from '../db'

export async function getCategories() {
  return await db.selectFrom('category').selectAll().execute()
}
