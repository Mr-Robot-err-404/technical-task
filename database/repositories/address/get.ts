import { db } from '../../db'

export async function getValidAddress() {
  return await db
    .selectFrom('address')
    .where('address.address', '!=', 'ANONYMOUS')
    .where(eb => eb('city_id', '=', 300).or('city_id', '=', 576))
    .select('address.address_id')
    .executeTakeFirst()
}
