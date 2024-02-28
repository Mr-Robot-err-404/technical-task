import app from '../app/app'
import request from 'supertest'
import { db } from '../database/db'
import crypto from 'crypto'

export interface Params {
  [key: string]: any
  store_id: number
  first_name: string
  last_name: string
  email: any
  phone: any
  address: any
  address2?: any
  district: string
  city_id: number
  postal_code: string
  invalid_field?: any
}

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

describe('creating a new customer', () => {
  describe('validation tests', () => {
    let params: any

    beforeEach(() => {
      params = { ...DEFAULT_PARAMS }
    })

    test('missing params', async () => {
      delete params.last_name
      const res = await request(app).post('/customers').send(params)
      expect(res.status).toBe(400)
      expect(res.body.message).toBe('invalid request')
    })

    describe('invalid field types', () => {
      const testCases = [
        { field: 'email', value: 'johnDoe@gmaildotcom', description: 'incorrect email format' },
        {
          field: 'postal_code',
          value: 'normal_string_but_very_long_postal_code',
          description: 'postal_code length exceeded',
        },
        { field: 'first_name', value: 'H@nsL@nd@', description: 'first_name with special characters' },
        { field: 'invalid_field', value: 'example', description: 'irrelevant field included' },
      ]
      testCases.forEach(({ field, value, description }) => {
        test(description, async () => {
          const testParams = { ...DEFAULT_PARAMS, [field]: value }
          const res = await request(app).post('/customers').send(testParams)
          expect(res.status).toBe(400)
          expect(res.body.message).toBe('invalid request')
        })
      })
    })

    test('invalid city_id', async () => {
      params.city_id = 7
      const res = await request(app).post('/customers').send(params)
      expect(res.status).toBe(400)
      expect(res.body.message).toBe('invalid city_id')
    })

    test('correct params', async () => {
      const uniqueUser = crypto.randomUUID().split('-')[0]
      params.email = `${uniqueUser}@gmail.com`

      const res = await request(app).post('/customers').send(params)
      expect(res.status).toBe(200)
      expect(res.body).toEqual({
        data: params,
      })
    })

    test('email already exists', async () => {
      params.email = 'mary.smith@sakilacustomer.org'

      const res = await request(app).post('/customers').send(params)
      expect(res.status).toBe(409)
      expect(res.body).toEqual({
        message: 'email already exists',
        email: 'mary.smith@sakilacustomer.org',
      })
    })
  })
})
