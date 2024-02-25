import { db } from '../../db'

export async function anonymizeCustomer(customer_id: number) {
  return await db
    .updateTable('customer')
    .set({
      first_name: 'ANONYMOUS',
      last_name: 'ANONYMOUS',
      email: 'ANONYMOUS',
      active: 0,
      activebool: false,
    })
    .where('customer_id', '=', customer_id)
    .executeTakeFirst()
}
