import express from 'express'
import { getFilms } from '../database/repositories/film/get'
import { getCategoryID } from '../database/repositories/category'
import { CustomerSchema } from '../lib/schema/customer'
import { getCityIDs } from '../database/repositories/city'
import { getCustomer, getCustomers, getSingleCustomer } from '../database/repositories/customer/get'
import { createCustomer } from '../database/repositories/customer/create'
import { isCityId } from '../lib/isCityId'
import { createAddress } from '../database/repositories/address/create'
import { z } from 'zod'
import { SearchSchema } from '../lib/schema/search'
import { CategorySchema } from '../lib/schema/category'
import { searchFilms } from '../database/repositories/film/search'
import { anonymizeCustomer } from '../database/repositories/customer/delete'
import { anonymizeAddress } from '../database/repositories/address/delete'
import { successResponse, errorResponse } from '../lib/res'

const app = express()

app.use(express.json())

app.get('/films/category', async (req, res) => {
  try {
    const query = req.query
    const validation = CategorySchema.safeParse(query)

    if (!validation.success) {
      return errorResponse(res, 400, 'invalid query', { query })
    }
    const categoryName = validation.data.categoryName
    const categoryID = await getCategoryID(categoryName)

    if (typeof categoryID?.category_id !== 'number') {
      return errorResponse(res, 404, 'invalid category', { categoryName })
    }
    const films = await getFilms(categoryID.category_id)

    if (films.length === 0) {
      return errorResponse(res, 404, 'no films were found with that category', { categoryName })
    }
    return successResponse(res, films)
  } catch (error) {
    console.error(error)
    return errorResponse(res, 500, 'internal server error occurred', { error })
  }
})

app.post('/customers', async (req, res) => {
  const params = req.body
  const validation = CustomerSchema.safeParse(params)

  if (!validation.success) {
    return errorResponse(res, 400, 'invalid request', { issues: validation.error.issues, params })
  }
  const { data } = validation

  try {
    const validCityIDs = await getCityIDs()

    if (!isCityId(validCityIDs, data.city_id)) {
      return errorResponse(res, 400, 'invalid city_id', { city_id: data.city_id, accept: validCityIDs })
    }
    const existingCustomer = await getSingleCustomer(data.email)

    if (existingCustomer.length > 0) {
      return errorResponse(res, 409, 'email already exists', { email: data.email })
    }
    const addressID = await createAddress(data)
    await createCustomer(data, addressID)

    return successResponse(res, { data })
  } catch (error) {
    console.error(error)
    return errorResponse(res, 500, 'internal server error', { error })
  }
})

app.delete('/customers/:customerID', async (req, res) => {
  const params = req.params.customerID
  const Schema = z.string().regex(/^\d+$/).min(1)
  const customerID = parseInt(params)
  const validation = Schema.safeParse(params)

  if (!validation.success || customerID > Number.MAX_SAFE_INTEGER) {
    return errorResponse(res, 400, 'invalid request', { params, accept: 'integer' })
  }
  try {
    const curr = await getCustomer(customerID)

    if (!curr || curr.email === 'ANONYMOUS') {
      return errorResponse(res, 404, 'customer does not exist', { customerID })
    }
    const customers = await getCustomers(curr.address_id)
    await anonymizeCustomer(customerID)

    if (customers.length === 1) {
      await anonymizeAddress(curr.address_id)
    }
    return successResponse(res, { customerID })
  } catch (error) {
    console.error(error)
    return errorResponse(res, 500, 'internal server error occurred', { error })
  }
})

app.get('/films', async (req, res) => {
  const query = req.query

  if (!query.title && !query.length) {
    return errorResponse(res, 400, 'query params should include a title or length', { query })
  }
  const validation = SearchSchema.safeParse(query)

  if (!validation.success) {
    return errorResponse(res, 400, 'invalid query params', {
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
      return errorResponse(res, 404, 'no matching search results', { query })
    }
    return successResponse(res, films)
  } catch (error) {
    console.error(error)
    return errorResponse(res, 500, 'internal server error occurred', { error })
  }
})

app.use((req, res) => {
  res.status(404).json({
    message: 'endpoint does not exist',
  })
})

export default app
