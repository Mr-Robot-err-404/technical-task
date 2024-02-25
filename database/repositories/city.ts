import { db } from '../db'

export async function getCityIDs() {
  return await db
    .selectFrom('store')
    .innerJoin('address', 'address.address_id', 'store.address_id')
    .select('city_id')
    .execute()
}
