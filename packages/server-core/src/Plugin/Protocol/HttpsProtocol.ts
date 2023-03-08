import fs from 'fs'
import https from 'https'
import path from 'path'
import {
  errorCaught, ErrorName, errorPromise, LoadType, PathDataOrError, 
  HttpsProtocol, ProtocolPromise, ProtocolType, Request, urlFilename, Runtime
} from "@moviemasher/moviemasher.js"

import { requestArgs, requestArgsHash } from '../../Utility/Request'
import { EnvironmentKeyApiDirTemporary } from '../../Environment/ServerEnvironment'
import { resolverExtension, resolverPromise } from '../../Resolve/Resolve'

const promise: ProtocolPromise = ((request: Request, type?: LoadType) => {
  if (type) return errorPromise(ErrorName.Type)

  console.log('HTTPS', request)
  const args = requestArgs(request)
  const hash = requestArgsHash(args)
  const { environment } = Runtime
  const temporaryDirectory = environment.get(EnvironmentKeyApiDirTemporary)
  
  const promise: Promise<PathDataOrError> = new Promise(resolve => {
    let file = ''
    let mimeType = ''
    const req = https.request(args, incomingMessage => {
      const { ['content-type']: fileMimeType = '' } = incomingMessage.headers
      const ext = resolverExtension(request, fileMimeType) 
      const filePath = path.resolve(temporaryDirectory, urlFilename(hash, ext))
      if (fs.existsSync(filePath)) {
        resolve(resolverPromise(filePath, fileMimeType, fileMimeType))
      } else {
        file = filePath
        mimeType = fileMimeType
        const stream = fs.createWriteStream(file)
        stream.on('finish', () => {
          stream.close()
          resolve(resolverPromise(file, mimeType, mimeType))
        })
        incomingMessage.socket.on('data', (data: any) => {
          // console.log('data', data) 
          // stream.(data)
        })

        

        stream.on('error', (error) => { resolve(errorCaught(error)) })

        // incomingMessage.pipe(stream) 
         
      }
    })
    if (file) {
      
    }
    req.on('error', (error: any) => { resolve(errorCaught(error)) })
    // req.end()
  })
  return promise
}) 

Runtime.plugins[ProtocolType][HttpsProtocol] ||= { promise, type: ProtocolType, protocol: HttpsProtocol }
