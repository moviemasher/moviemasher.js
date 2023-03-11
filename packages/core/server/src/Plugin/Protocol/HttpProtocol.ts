import fs from 'fs'
import http from 'http'
import https from 'https'
import path from 'path'

import { 
  AudioType, 
  DataOrError, 
  error, errorCaught, ErrorName, FontType, HttpProtocol, ImageType, 
  isDefiniteError, isPopulatedString, 
  LoadType, ProtocolDataOrError,
  ProtocolType, RecordsType, RecordType, Request, requestExtension, 
  Runtime, TextExtension, urlFilename, VideoType, ClientImage, ClientAudio, ClientFont, ClientVideo, JsonRecord, JsonRecords, StringType, resolveMimetypePromise, isClientMediaType, StringData, pluginPromise, ResolveType, pluginDataOrErrorPromise, endpointFromUrl, requestPromise, requestClientMediaPromise, ClientMedia, assertPopulatedString, HttpsProtocol
} from "@moviemasher/moviemasher.js"
import { EnvironmentKeyApiDirTemporary } from '../../Environment/ServerEnvironment'
import { requestArgs, requestArgsHash } from '../../Utility/Request'


interface FileAndMimetype { 
  file: string, 
  mimetype: string 
  mimeOk: boolean
  extOk: boolean
}

const temporaryExtension = TextExtension
const filePromise = (request: Request, type: LoadType): Promise<DataOrError<FileAndMimetype>> => {
  const args = requestArgs(request)
  const { protocol } = args
  assertPopulatedString(protocol)
  const htt = protocol.startsWith(HttpsProtocol) ? https : http

  const hash = requestArgsHash(args)

  const { environment } = Runtime
  const temporaryDirectory = environment.get(EnvironmentKeyApiDirTemporary)

  const requestExt = requestExtension(request) 
  const extOk = isPopulatedString(requestExt) 

  const promise: Promise<DataOrError<FileAndMimetype>> = new Promise(resolve => {
    const req = htt.request(args, response => {
      const { ['content-type']: mimetype = '' } = response.headers
      const mimeOk = isPopulatedString(mimetype) && mimetype.startsWith(type)
      const ext = (mimeOk && extOk) ? requestExt : temporaryExtension 
      const file = path.resolve(temporaryDirectory, urlFilename(hash, ext))
      const data = { file, mimetype, mimeOk, extOk }
      if (fs.existsSync(file)) {
        resolve({ data })
      } else {
        const stream = fs.createWriteStream(file)
        stream.on('finish', () => {
          stream.close()
          resolve({ data })

        })
        stream.on('error', (error) => { resolve(errorCaught(error)) })
        // response.pipe(stream)  
      }
    })
    req.on('error', (error: any) => { resolve(errorCaught(error)) })
    // req.end()
  })
  return promise
}

function promise(request: Request, type: ImageType): Promise<DataOrError<ClientImage>>
function promise(request: Request, type: AudioType): Promise<DataOrError<ClientAudio>>
function promise(request: Request, type: FontType): Promise<DataOrError<ClientFont>>
function promise(request: Request, type: VideoType): Promise<DataOrError<ClientVideo>>
function promise(request: Request, type: RecordType): Promise<DataOrError<JsonRecord>>
function promise(request: Request, type: RecordsType): Promise<DataOrError<JsonRecords>>
function promise(request: Request, type: StringType): Promise<DataOrError<string>>
function promise(request: Request, type: LoadType): Promise<ProtocolDataOrError>
function promise(request: Request, type: LoadType): Promise<ProtocolDataOrError>
{
  return filePromise(request, type).then(onError => {
    if (isDefiniteError(onError)) return onError

    const { data } = onError
    const { file, mimetype, mimeOk, extOk } = data
    if (mimeOk && extOk) return { data: file } as StringData
      // file was saved with temporary extension
    if (mimetype) {
      if (type === FontType) {
        return pluginDataOrErrorPromise(mimetype, ResolveType).then(onError => {
          if (isDefiniteError(onError)) return onError

          const resolvePlugin = onError.data
          const url = resolvePlugin.url(file, type)
          if (url) {
            const request: Request = { endpoint: endpointFromUrl(url) }
            return requestPromise(request, StringType)
            // switch (type) {
            //   case AudioType: { const something = requestClientMediaPromise(request, type).then(onError => {
            //     if (isDefiniteError(onError)) return onError
            //     const { data } = onError

            //    return error(ErrorName.Type)
            //   }); break }
            //   case FontType: { const something = requestClientMediaPromise(request, type); break }
            //   case ImageType: { const something = requestClientMediaPromise(request, type); break }
            //   case VideoType: { const something = requestClientMediaPromise(request, type); break }
            // }
          }

          // switch (type) {
          //   case AudioType: return resolvePlugin.promise(file, type)
          //   case FontType: return resolvePlugin.promise(file, type)
          //   case ImageType: return resolvePlugin.promise(file, type)
          //   case VideoType: return resolvePlugin.promise(file, type)
          // }
        
          return error(ErrorName.Type)
          // return data.promise(file, type)
        })
      }
    }
    return error(ErrorName.Type)
  })
}
  // // if (type) return errorPromise(ErrorName.Type)

  // const args = requestArgs(request)
  // const hash = requestArgsHash(args)
  // const { environment } = Runtime
  // const temporaryDirectory = environment.get(EnvironmentKeyApiDirTemporary)
  

  // const promise: Promise<StringDataOrError> = new Promise(resolve => {
  //   const req = http.request(args, response => {
  //     const { ['content-type']: mimeType = '' } = response.headers

  //     switch(type) {
  //       case FontType: return fontPromise()
        
  //       {

  //       }
  //       default: {

  //       }
  //     }
  //     const ext = resolverExtension(request, mimeType) 
  //     const file = path.resolve(temporaryDirectory, urlFilename(hash, ext))
  //     if (fs.existsSync(file)) {
  //       resolve(resolvePromise(file, mimeType, mimeType))
  //     } else {
  //       const stream = fs.createWriteStream(file)
  //       stream.on('finish', () => {
  //         stream.close()
  //         resolve(resolvePromise(file, mimeType, mimeType))
  //       })
  //       stream.on('error', (error) => { resolve(errorCaught(error)) })
  //       // response.pipe(stream)  
  //     }
  //   })
  //   req.on('error', (error: any) => { resolve(errorCaught(error)) })
  //   // req.end()
  // })
  // return promise
// }) 
Runtime.plugins[ProtocolType][HttpProtocol] ||= { promise, type: ProtocolType, protocol: HttpProtocol }
Runtime.plugins[ProtocolType][HttpsProtocol] ||= { promise, type: ProtocolType, protocol: HttpsProtocol }
