import app from "../app/app"
import request from 'supertest'

function createQuery(title?: string, length?: string) {
    let str = '?'

    if (title) {
        str += `title=${title}`
    }
    if (length) {
        if (title) {
            str += `&length=${length}`
        }
        else str += `length=${length}`
    }
    return str
}

describe("searching films with an optional length and title", () => {
    describe("validation tests", () => {
        let title = ''
        let length = ''

        beforeEach(() => {
            title = 'to'
            length = '60'
        })

        test("empty query", async () => {
            const query = createQuery()
            const res = await request(app).get(`/api/films${query}`)

            expect(res.status).toBe(400)
            expect(res.body).toEqual({
                "message": "query params should include a title or length", 
            })
        })
        test("title with special characters", async () => {
            const query = createQuery('st@r w@rs', length)
            const res = await request(app).get(`/api/films${query}`)

            expect(res.status).toBe(400)
            expect(res.body.message).toBe("invalid query params")
        })
        test('non-integer length', async() => {
            const query = createQuery(title, 'length')
            const res = await request(app).get(`/api/films${query}`)

            expect(res.status).toBe(400)
            expect(res.body.message).toBe("invalid query params")
        })
        test('correct params', async () => {
            const query = createQuery(title, length)
            const res = await request(app).get(`/api/films${query}`)

            expect(res.status).toBe(200)
            expect(res.body.message).toBe("films fetched successfully")
            expect(res.body.films.length).toBe(8)
        })
    })
})