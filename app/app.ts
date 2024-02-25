import express from 'express'
import { getFilms } from '../database/repositories/film/get'
import { getCategories } from '../database/repositories/category'
import { findCategoryId, isCategoryValid } from '../lib/category'
import { CustomerSchema } from '../lib/schema/customer'
import { getCityIDs } from '../database/repositories/city'
import { getCustomer, getCustomers, getSingleCustomer } from '../database/repositories/customer/get'
import { createCustomer } from '../database/repositories/customer/create'
import { isCityId } from '../lib/isCityId'
import { createAddress } from '../database/repositories/address/create'
import { z } from 'zod'
import { SearchSchema } from '../lib/schema/search'
import { searchFilms } from '../database/repositories/film/search'
import { anonymizeCustomer } from '../database/repositories/customer/delete'
import { anonymizeAddress } from '../database/repositories/address/delete'
import { sendResponse } from '../lib/res'

const app = express()

app.use(express.json())

app.get('/api/films/:category_name', async (req, res) => {
  try {
    const valid_categories = await getCategories()
    const category_name = req.params.category_name

    if (!isCategoryValid(category_name, valid_categories)) {
      return sendResponse(res, 404, 'invalid category', { category_name })
    }
    const category_id = findCategoryId(category_name, valid_categories)
    const films = await getFilms(category_id)

    if (films.length === 0) {
      return sendResponse(res, 404, 'no films were found with that category', { category_name })
    }
    return sendResponse(res, 200, 'films were fetched successfully', { category_name, films })
  } catch (error) {
    console.error(error)
    return sendResponse(res, 500, 'internal server error occurred', { error })
  }
})

app.post('/api/customers', async (req, res) => {
  const params = req.body
  const validation = CustomerSchema.safeParse(params)

  if (!validation.success) {
    return sendResponse(res, 400, 'invalid request', { issues: validation.error.issues, params })
  }
  const { data } = validation

  try {
    const valid_cityIDs = await getCityIDs()

    if (!isCityId(valid_cityIDs, data.city_id)) {
      return sendResponse(res, 400, 'invalid city_id', { city_id: data.city_id, accept: valid_cityIDs })
    }
    const existing_customer = await getSingleCustomer(data.email)

    if (existing_customer.length > 0) {
      return sendResponse(res, 409, 'email already exists', { email: data.email })
    }
    const address_id = await createAddress(data)
    const new_customer = await createCustomer(data, address_id)

    return sendResponse(res, 200, 'new customer created successfully', { data })
  } catch (error) {
    console.error(error)
    return sendResponse(res, 500, 'internal server error', { error })
  }
})

app.delete('/api/customers/:customer_id', async (req, res) => {
  const params = req.params.customer_id
  const Schema = z.string().regex(/^\d+$/).min(1)
  const customer_id = parseInt(params)
  const validation = Schema.safeParse(params)

  if (!validation.success || customer_id > Number.MAX_SAFE_INTEGER) {
    return sendResponse(res, 400, 'invalid request', { params, accept: 'integer' })
  }
  try {
    const curr = await getCustomer(customer_id)

    if (!curr || curr.email === 'ANONYMOUS') {
      return sendResponse(res, 404, 'customer does not exist', { customer_id })
    }
    const customers = await getCustomers(curr.address_id)
    await anonymizeCustomer(customer_id)

    if (customers.length === 1) {
      await anonymizeAddress(curr.address_id)
    }
    return sendResponse(res, 200, 'customer deleted successfully', { customer_id })
  } catch (error) {
    console.error(error)
    return sendResponse(res, 500, 'internal server error occurred', { error })
  }
})

app.get('/api/films', async (req, res) => {
  const query = req.query

  if (!query.title && !query.length) {
    return sendResponse(res, 400, 'query params should include a title or length', { query })
  }
  const validation = SearchSchema.safeParse(query)

  if (!validation.success) {
    return sendResponse(res, 400, 'invalid query params', {
      query,
      issues: validation.error.issues,
      accept: ['title', 'length'],
    })
  }
  const { data } = validation
  let length: number | undefined

  if (typeof data.length === 'string') {
    length = parseInt(data.length)
  }

  try {
    const films = await searchFilms(data.title, length)

    if (!films.length) {
      return sendResponse(res, 404, 'no matching search results', { query })
    }

    return sendResponse(res, 200, 'films fetched successfully', { query, films })
  } catch (error) {
    console.error(error)
    return sendResponse(res, 500, 'internal server error occurred', { error })
  }
})

app.use((req, res) => {
  res.status(404).json({
    message: "endpoint doesn't exist",
  })
})

export default app
