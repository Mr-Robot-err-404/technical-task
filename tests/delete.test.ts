import app from '../app/app'
import request from 'supertest'
import { db } from '../database/db'
import { createCustomer } from '../database/repositories/customer/create'
import { getValidAddress } from '../database/repositories/address/get'
import { Params } from './post.test'

const DEFAULT_PARAMS: Params = {
  store_id: 1,
  first_name: 'John',
  last_name: 'Doe',
  email: 'johndoe@gmail.com',
  phone: '0771321480',
  address: '7 Jury Lane',
  district: 'Alberta',
  city_id: 300,
  postal_code: 'HA-G50',
}

afterAll(async () => {
  await db.destroy()
})

describe('deleting a customer by their customer_id', () => {
  describe('validation tests', () => {
    test('non-integer params', async () => {
      const res = await request(app).delete(`/customers/master_yoda`)
      expect(res.status).toBe(400)
      expect(res.body).toEqual({
        message: 'invalid request',
        params: 'master_yoda',
        accept: 'integer',
      })
    })
    test('very large number', async () => {
      const large_int = Number.MAX_SAFE_INTEGER + 1
      const res = await request(app).delete(`/customers/${large_int}`)
      expect(res.status).toBe(400)
      expect(res.body).toEqual({
        message: 'invalid request',
        params: `${large_int}`,
        accept: 'integer',
      })
    })
    test('customer_id not found', async () => {
      const res = await request(app).delete(`/customers/7800`)
      expect(res.status).toBe(404)
      expect(res.body).toEqual({
        message: 'customer does not exist',
        customerID: 7800,
      })
    })
    test('correct params', async () => {
      const params = { ...DEFAULT_PARAMS }
      const unique_user = crypto.randomUUID().split('-')[0]
      params.email = `${unique_user}@gmail.com`

      const valid_address = await getValidAddress()
      const new_customer = await createCustomer(params, valid_address?.address_id || 7)

      const res = await request(app).delete(`/customers/${new_customer.customer_id}`)
      expect(res.status).toBe(200)
    })
  })
})
