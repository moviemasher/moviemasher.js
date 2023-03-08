import fs from 'fs'
import http from 'http'
import path from 'path'

import {
  errorCaught, ErrorName, errorPromise, LoadType, PathDataOrError, 
  HttpProtocol, ProtocolPromise, ProtocolType, Request, 
  urlFilename, Runtime
} from "@moviemasher/moviemasher.js"
import { requestArgs, requestArgsHash } from '../../Utility/Request'
import { EnvironmentKeyApiDirTemporary } from '../../Environment/ServerEnvironment'
import { resolverExtension, resolverPromise } from '../../Resolve/Resolve'

const promise: ProtocolPromise = ((request: Request, type?: LoadType) => {
  if (type) return errorPromise(ErrorName.Type)

  console.log('HTTP', request)
  const args = requestArgs(request)
  const hash = requestArgsHash(args)
  const { environment } = Runtime
  const temporaryDirectory = environment.get(EnvironmentKeyApiDirTemporary)
  
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
        // response.pipe(stream)  
      }
    })
    req.on('error', (error: any) => { resolve(errorCaught(error)) })
    // req.end()
  })
  return promise
}) 
Runtime.plugins[ProtocolType][HttpProtocol] ||= { promise, type: ProtocolType, protocol: HttpProtocol }
