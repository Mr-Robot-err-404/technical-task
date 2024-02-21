import app from "../app/app"
import request from 'supertest'

class Params {
    store_id: number
    first_name: string
    last_name: any
    email: any
    phone: any
    address: any
    address2?: any
    district: any
    city_id: number
    postal_code: string
    invalid_field?: any

    constructor() {
        this.store_id = 1
        this.first_name = "John"
        this.last_name = "Doe"
        this.email = "johndoe@gmail.com"
        this.phone = "0771321480"
        this.address = "7 Jury Lane"
        this.district = "Alberta"
        this.city_id = 300
        this.postal_code = "HA-G50"
    }
}

describe("creating a new customer", () => {
    describe("validation tests", () => {
        let params: any

        beforeEach(() => {
            params = new Params()
        })

        test("invalid Content-Type", async() => {
            const res = await request(app).post('/api/customers').send("invalid_Content-Type")
            expect(res.status).toBe(400)
            expect(res.body).toEqual({
                "message": "invalid Content-Type", 
                "accept": "application/json"
            })
        })
        test("missing params", async () => {
            delete params.email
            const res = await request(app).post('/api/customers').send(params)
            expect(res.status).toBe(400)
            expect(res.body.message).toBe("invalid request")
        })

        describe("invalid field types", () => {
            test("incorrect email format", async () => {
                params.email = "johnDoe@gmaildotcom"
                const res = await request(app).post('/api/customers').send(params)
                expect(res.status).toBe(400)
                expect(res.body.message).toBe("invalid request")
            })

            test("postal_code length exceeded", async () => {
                params.postal_code = "normal_string_but_very_long_postal_code"
                const res = await request(app).post('/api/customers').send(params)
                expect(res.status).toBe(400)
                expect(res.body.message).toBe("invalid request")
            })

            test("first_name with special characters", async () => {
                params.first_name = "H@nsL@nd@"
                const res = await request(app).post('/api/customers').send(params)
                expect(res.status).toBe(400)
                expect(res.body.message).toBe("invalid request")
            })

            test("irrelevant field included", async() => {
                params.invalid_field = "example"
                const res = await request(app).post('/api/customers').send(params)
                expect(res.status).toBe(400)
                expect(res.body.message).toBe("invalid request")
            })
        })

        test("invalid city_id", async () => {
            params.city_id = 7
            const res = await request(app).post('/api/customers').send(params)
            expect(res.body).toEqual({
                "message": "invalid city_id", 
                "city_id": 7, 
                "accept": [{ "city_id": 300 }, { "city_id": 576 }]
            })
        })

        // test("correct params", async () => {
        //     const res = await request(app).post('/api/customers').send(params)
        //     expect(res.status).toBe(200)
        //     expect(res.body).toEqual({
        //         "message": "new customer created successfully", 
        //         "new_customer": params
        //     })
        // })

        test("email already exists", async() => {
            params.email = "mary.smith@sakilacustomer.org"

            const res = await request(app).post('/api/customers').send(params)
            expect(res.status).toBe(409)
            expect(res.body).toEqual({
                "message": "email already exists", 
                "email": "mary.smith@sakilacustomer.org"
            })
        })
    })
})