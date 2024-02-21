import { db } from "../../db"

export async function deleteAddress(address_id: number) {
    return await db.deleteFrom('address')
        .where('address.address_id', '=', address_id)
        .executeTakeFirst()
}