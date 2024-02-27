import { db } from '../../db'

export async function getValidAddress() {
  return await db
    .selectFrom('address')
    .where('address.address', '!=', 'ANONYMOUS')
    .select('address.address_id')
    .executeTakeFirst()
}
