import { db } from '../../db'

export async function anonymizeAddress(address_id: number) {
  return await db
    .updateTable('address')
    .set({
      address: 'ANONYMOUS',
      address2: 'ANONYMOUS',
      district: 'ANONYMOUS',
      postal_code: 'ANONYMOUS',
      phone: 'ANONYMOUS',
    })
    .where('address_id', '=', address_id)
    .executeTakeFirst()
}
