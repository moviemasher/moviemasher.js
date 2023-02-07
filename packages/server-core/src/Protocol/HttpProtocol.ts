import fs from 'fs'
import http from 'http'

import path from 'path'

import { errorFromAny, RequestObject, ProtocolPromise, Protocols, urlFilename, RequestRecord, PathOrError, DefinitionType, resolverPromise, resolverExtension } from "@moviemasher/moviemasher.js"
import { requestArgs, requestArgsHash } from '../Utility/Request'
import { Environment, environment } from '../Utility/Environment'


const promise = ((request: RequestObject, type?: string | DefinitionType) => {
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
        stream.on('error', (error) => { resolve(errorFromAny(error)) })
        response.pipe(stream)  
      }
    })
    req.on('error', (error: any) => { resolve(errorFromAny(error)) })
    req.end()
  })
  return promise
}) as ProtocolPromise

Protocols.http = { promise }
Protocols.https = { promise }
