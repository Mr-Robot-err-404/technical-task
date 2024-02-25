import app from '../app/app'
import request from 'supertest'
import { db } from '../database/db'

afterAll(async () => {
  await db.destroy()
})

function createQuery(title?: string, length?: string) {
  let str = '?'

  if (title) {
    str += `title=${title}`
  }
  if (length) {
    if (title) {
      str += `&length=${length}`
    } else str += `length=${length}`
  }
  return str
}

describe('searching films with an optional length and title', () => {
  describe('validation tests', () => {
    let title = ''
    let length = ''

    beforeEach(() => {
      title = 'to'
      length = '60'
    })

    const testCases = [
      {
        description: 'empty query',
        curr_query: {
          title: undefined,
          length: undefined,
        },
        message: 'query params should include a title or length',
      },
      {
        description: 'title with special characters',
        curr_query: {
          title: 'st@r w@rs',
          length: length,
        },
      },
      {
        description: 'non-integer length',
        curr_query: {
          title: title,
          length: 'length_string',
        },
      },
    ]

    testCases.forEach(({ description, curr_query, message }) => {
      test(description, async () => {
        const query = createQuery(curr_query.title, curr_query.length)
        const res = await request(app).get(`/api/films${query}`)

        expect(res.status).toBe(400)
        if (message) {
          expect(res.body.message).toBe('query params should include a title or length')
        } else expect(res.body.message).toBe('invalid query params')
      })
    })

    test('no search results', async () => {
      const query = createQuery('Lord of the Rings', '30')
      const res = await request(app).get(`/api/films${query}`)

      expect(res.status).toBe(404)
      expect(res.body.message).toBe('no matching search results')
    })

    test('correct params', async () => {
      const query = createQuery(title, length)
      const res = await request(app).get(`/api/films${query}`)

      expect(res.status).toBe(200)
      expect(res.body.message).toBe('films fetched successfully')
      expect(res.body.films.length).toBe(8)
    })
  })
})
