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

export async function createCustomer(data: Data, address_id: number) {
  return await db
    .insertInto('customer')
    .values({
      store_id: data.store_id,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      address_id: address_id,
      active: 1,
    })
    .returning(['customer_id', 'activebool', 'create_date', 'last_update'])
    .executeTakeFirstOrThrow()
}
