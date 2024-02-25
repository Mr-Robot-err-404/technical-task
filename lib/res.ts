import { Response } from 'express'

interface Data {
  [key: string]: any
}

export function sendResponse(res: Response, status_code: number, message: string, data: Data) {
  return res.status(status_code).json({
    message: message,
    ...data,
  })
}
