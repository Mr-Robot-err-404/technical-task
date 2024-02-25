import app from '../app/app'
import request from 'supertest'
import { db } from '../database/db'

afterAll(async () => {
  await db.destroy()
})

describe('fetching films through category_name', () => {
  describe('validation tests', () => {
    test('false category', async () => {
      const res = await request(app).get('/api/films/false_category')
      expect(res.status).toBe(404)
      expect(res.body).toEqual({
        message: 'invalid category',
        category_name: 'false_category',
      })
    })
    test('lowercase', async () => {
      const res = await request(app).get('/api/films/action')
      expect(res.status).toBe(404)
      expect(res.body).toEqual({
        message: 'invalid category',
        category_name: 'action',
      })
    })
    test('correct category', async () => {
      const res = await request(app).get('/api/films/Action')
      expect(res.status).toBe(200)
      expect(res.body.message).toBe('films were fetched successfully')
    })
  })
})
