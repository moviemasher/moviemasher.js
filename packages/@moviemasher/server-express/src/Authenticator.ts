import createServer from 'connect'
import { response } from 'express'

export const Authenticator: createServer.NextHandleFunction = (req, res, next) => {
  if (!req.httpVersion) {
    console.warn('Authenticator blocked')
    response.statusCode = 401
    res.end('')
  }
  else next()
}
