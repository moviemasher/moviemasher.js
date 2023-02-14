import fs from 'fs'
import http from 'http'

import path from 'path'

import {
  errorCaught, MediaType, PathOrError, Plugins, ProtocolHttp, ProtocolHttps, ProtocolPromise, Request, RequestRecord, resolverExtension, resolverPromise, urlFilename
} from "@moviemasher/moviemasher.js"
import { Environment, environment } from '../../Environment/Environment'
import { requestArgs, requestArgsHash } from '../../Utility/Request'


const promise = ((request: Request, type?: string | MediaType) => {
  console.log('HTTP', request)
  const record: RequestRecord = {}
  const response: PathOrError = { path: '' }
  const { endpoint } = request

  const args = requestArgs(request)
  const hash = requestArgsHash(args)
  const temporaryDirectory = environment(Environment.API_DIR_TEMPORARY)


  const promise: Promise<PathOrError> = new Promise(resolve => {
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
}) as ProtocolPromise

Plugins.protocols.http = { promise, type: ProtocolHttp }
Plugins.protocols.https = { promise, type: ProtocolHttps }
