import app from "../app/app"
import request from 'supertest'

describe("deleting a customer by their customer_id", () => {
    describe("validation tests", () => {
        test("non-integer params", async() => {
            const res = await request(app).delete(`/api/customers/master_yoda`)
            expect(res.status).toBe(400)
            expect(res.body).toEqual({
                "message": "invalid request", 
                "params": "master_yoda", 
                "accept": "integer"
            })
        })
        test("very large number", async () => {
            const large_int = Number.MAX_SAFE_INTEGER + 1
            const res = await request(app).delete(`/api/customers/${large_int}`)
            expect(res.status).toBe(400)
            expect(res.body).toEqual({
                "message": "invalid request", 
                "params": `${large_int}`, 
                "accept": "integer"
            })
        })
        test("customer_id not found", async() => {
            const res = await request(app).delete(`/api/customers/7800`)
            expect(res.status).toBe(404)
            expect(res.body).toEqual({
                "message": "customer does not exist", 
                "customer_id": 7800
            })
        })
    })
})