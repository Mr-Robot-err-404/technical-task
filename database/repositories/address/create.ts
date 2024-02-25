import { db } from '../../db'

interface Data {
  address: string
  postal_code: string
  city_id: number
  district: string
  phone: string
  store_id: number
  first_name: string
  last_name: string
  email: string
  address2?: string | undefined
}

export async function createAddress(data: Data) {
  const existing_address = await db
    .selectFrom('address')
    .where('postal_code', '=', data.postal_code)
    .where('address', '=', data.address)
    .select('address_id')
    .executeTakeFirst()

  if (typeof existing_address?.address_id === 'number') {
    return existing_address.address_id
  }

  const result = await db
    .insertInto('address')
    .values({
      address: data.address,
      district: data.district,
      city_id: data.city_id,
      postal_code: data.postal_code,
      phone: data.phone,
      address2: data.address2 || '',
    })
    .returning(['address_id'])
    .executeTakeFirstOrThrow()

  return result.address_id
}
