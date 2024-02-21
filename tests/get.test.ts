import app from "../app/app"
import request from 'supertest'

describe("fetching films through category_name", () => {
    
    describe("validation tests", () => {
        test("false category", async() => {
            const res = await request(app).get('/api/films/false_category')
            expect(res.status).toBe(404)
            expect(res.body).toEqual({
                "message": "invalid category", 
                "category": "false_category"
            })
        })
        test("lowercase", async() => {
            const res = await request(app).get('/api/films/action')
            expect(res.status).toBe(404)
            expect(res.body).toEqual({
                "message": "invalid category", 
                "category": "action"
            })
        })
        test("correct category", async() => {
            const res = await request(app).get('/api/films/Action')
            expect(res.status).toBe(200)
        })
    })
})