import fs from 'fs'
import http from 'http'
import path from 'path'

import {
  errorCaught, ErrorName, errorPromise, LoadType, PathDataOrError, Plugins, 
  HttpProtocol, ProtocolPromise, ProtocolType, Request, resolverExtension, resolverPromise, 
  urlFilename
} from "@moviemasher/moviemasher.js"
import { Environment, environment } from '../../Environment/Environment'
import { requestArgs, requestArgsHash } from '../../Utility/Request'

const promise: ProtocolPromise = ((request: Request, type?: LoadType) => {
  if (type) return errorPromise(ErrorName.Type)

  console.log('HTTP', request)
  const args = requestArgs(request)
  const hash = requestArgsHash(args)
  const temporaryDirectory = environment(Environment.API_DIR_TEMPORARY)

  const promise: Promise<PathDataOrError> = new Promise(resolve => {
    const req = http.request(args, response => {
      const { ['content-type']: mimeType = '' } = response.headers
      const ext = resolverExtension(request, mimeType) 
      const file = path.resolve(temporaryDirectory, urlFilename(hash, ext))
      if (fs.existsSync(file)) {
        resolve(resolverPromise(file, mimeType, mimeType))
      } else {
        const stream = fs.createWriteStream(file)
        stream.on('finish', () => {
          stream.close()
          resolve(resolverPromise(file, mimeType, mimeType))
        })
        stream.on('error', (error) => { resolve(errorCaught(error)) })
        response.pipe(stream)  
      }
    })
    req.on('error', (error: any) => { resolve(errorCaught(error)) })
    req.end()
  })
  return promise
}) 
Plugins[ProtocolType][HttpProtocol] = { promise, type: HttpProtocol }
