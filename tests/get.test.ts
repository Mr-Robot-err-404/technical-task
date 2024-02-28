import app from '../app/app'
import request from 'supertest'
import { db } from '../database/db'

afterAll(async () => {
  await db.destroy()
})

describe('fetching films through categoryName', () => {
  describe('validation tests', () => {
    let query = ''

    beforeEach(() => {
      query = '?categoryName='
    })

    test('false query', async () => {
      query += 'example123'
      const res = await request(app).get(`/films/category${query}`)
      expect(res.status).toBe(400)
      expect(res.body.message).toBe('invalid query')
    })

    test('false category', async () => {
      query += 'falseCategory'
      const res = await request(app).get(`/films/category${query}`)
      expect(res.status).toBe(404)
      expect(res.body.message).toBe('invalid category')
    })

    test('correct query', async () => {
      query += 'Action'
      const res = await request(app).get(`/films/category${query}`)
      expect(res.status).toBe(200)
    })

    test('correct query with lowercase', async () => {
      query += 'action'
      const res = await request(app).get(`/films/category${query}`)
      expect(res.status).toBe(200)
    })
  })
})
