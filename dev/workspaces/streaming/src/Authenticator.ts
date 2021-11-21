import createServer from "connect"
import { response } from "express"

const Authenticator: createServer.NextHandleFunction = (req, res, next) => {
  if (!req.httpVersion) {
    console.log("Authenticator blocked")
    response.statusCode = 401
    res.end('')
  }
  else next()
}

export { Authenticator }
