import express from 'express'
import { getFilms } from '../database/repositories/films'
import { getCategories } from '../database/repositories/category'
import { findCategoryId, isCategory } from '../lib/category'
import { CustomerSchema } from '../lib/schema'
import { getCityIDs } from '../database/repositories/city'
import { getAddressID, getCustomers, getSingleCustomer } from '../database/repositories/customer/get'
import { createCustomer } from '../database/repositories/customer/create'
import { deleteCustomer } from '../database/repositories/customer/delete'
import { isCityId } from '../lib/isCityId'
import { createAddress } from '../database/repositories/address/create'
import { deleteAddress } from '../database/repositories/address/delete'
import { z } from 'zod'

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.send("endpoint 2 pending...")
})

app.get('/api/films/:category_name', async (req, res) => {
    try {
        const categories = await getCategories()
        const category_name = req.params.category_name

        if (!isCategory(category_name, categories)) {
            return res.status(404).json({
                message: "invalid category", 
                category: category_name, 
            })
        }
        const category_id = findCategoryId(category_name, categories)
        const films = await getFilms(category_id)
        
        res.status(200).json({
            message: "films were fetched successfully", 
            category: category_name, 
            films: films
        })
    }
    catch (error) {
        res.status(500).json({
            message: "internal server error occurred"
        })
    }
})

app.post('/api/customers', async (req, res) => {
    if (!req.is('json')) {
        return res.status(400).json({
            message: "invalid Content-Type",
            accept: "application/json"
        })
    }
    const params = req.body
    const validation = CustomerSchema.safeParse(params)

    if (!validation.success) {
        return res.status(400).json({
            message: "invalid request", 
            issues: validation.error.issues, 
            body: params
        })
    }
    const data = validation.data

    try {
        const cityIDs = await getCityIDs()

        if (!isCityId(cityIDs, data.city_id)) {
            return res.status(400).json({
                message: "invalid city_id", 
                city_id: data.city_id, 
                accept: cityIDs
            })
        }
        const existing_customer = await getSingleCustomer(data.email)

        if (existing_customer.length > 0) {
            return res.status(409).json({
                message: "email already exists", 
                email: data.email
            })
        }
        const address_id = await createAddress(data)
        const new_customer = await createCustomer(data, address_id)

        res.status(200).json({
            message: "new customer created successfully", 
            new_customer: data
        })
    }
    catch (error) {
        res.status(500).json({
            message: "internal server error",
            error: error
        })
    }
})

app.delete('/api/customers/:customer_id', async (req, res) => {
    const params = req.params.customer_id
    const Schema = z.string().regex(/^\d+$/)
    const customer_id = parseInt(params)
    const validation = Schema.safeParse(params)

    if (!validation.success || customer_id > Number.MAX_SAFE_INTEGER) {
        return res.status(400).json({
            message: "invalid request",
            params: params, 
            accept: "integer"
        })
    }
    try {
        const curr = await getAddressID(customer_id)

        if (!curr) {
            return res.status(404).json({
                message: "customer does not exist",
                customer_id: customer_id
            })
        }
        const customers = await getCustomers(curr.address_id)

        if (customers.length === 1) {
            await deleteAddress(curr.address_id)
        }
        await deleteCustomer(customer_id)

        res.status(200).json({
            message: "customer deleted successfully", 
            customer_id: customer_id
        })
    }
    catch (error) {
        res.status(500).json({
            message: "internal server error occurred", 
            error: error
        })
    }
})

export default app
