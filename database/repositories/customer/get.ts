import { db } from '../../db'

export async function getCustomer(customer_id: number) {
  return await db
    .selectFrom('customer')
    .where('customer.customer_id', '=', customer_id)
    .select(['address_id', 'email'])
    .executeTakeFirst()
}

export async function getCustomers(address_id: number) {
  return await db
    .selectFrom('customer')
    .where('customer.address_id', '=', address_id)
    .select('customer.customer_id')
    .execute()
}

export async function getSingleCustomer(email: string) {
  return await db.selectFrom('customer').where('customer.email', '=', email).execute()
}
