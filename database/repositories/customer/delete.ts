import { db } from "../../db"

export async function deleteCustomer(customer_id: number) {
    return await db.selectFrom('customer')
        .where('customer.customer_id', '=', customer_id)
        .executeTakeFirst()
}