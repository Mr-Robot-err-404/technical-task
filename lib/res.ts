import { Response } from 'express'

interface Data {
  [key: string]: any
}

export function successResponse(res: Response, data: Data) {
  return res.status(200).json(data)
}

export function errorResponse(res: Response, statusCode: number, message: string, data: Data) {
  res.status(statusCode).json({
    message: message,
    ...data,
  })
}
