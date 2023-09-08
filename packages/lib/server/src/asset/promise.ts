import type { ServerMediaRequest } from '@moviemasher/runtime-server'
import type { DataOrError, EndpointRequest, LoadType, StringData, StringDataOrError, } from '@moviemasher/runtime-shared'

import { DOT, TextExtension, assertDefined, requestUrl, urlFilename, urlFromCss } from '@moviemasher/lib-shared'
import { EventServerAssetPromise, MovieMasher } from '@moviemasher/runtime-server'
import { ERROR, TypeFont, error, errorCaught, isDefiniteError, isPopulatedString, isString } from '@moviemasher/runtime-shared'
import fs from 'fs'
import path from 'path'
import { Readable } from 'stream'
import { finished } from 'stream/promises'
import { ReadableStream } from 'stream/web'
import { EnvironmentKeyApiDirTemporary, RuntimeEnvironment } from '../Environment/Environment.js'
import { filePathExists, fileRead } from '../Utility/File.js'
import { pathResolvedToPrefix, requestArgsHash } from '../Utility/Request.js'

const ProtocolFile = 'file'
const ProtocolHttp = 'http'
const temporaryExtension = TextExtension

interface FileAndMimetype { 
  filePath: string, 
  mimetype: string 
  mimeOk: boolean
  extOk: boolean
}

const requestExtension = (request: EndpointRequest): string => {
  const { endpoint } = request
  assertDefined(endpoint)
  
  const pathname = isString(endpoint) ? endpoint : endpoint.pathname || ''
  const last = pathname.split(DOT).pop() || ''
  return last.trim()
}

const fetchPromise = (url: string, request: EndpointRequest, type: LoadType): Promise<DataOrError<FileAndMimetype>> => {
  console.log('fetchPromise', request, type)
  
  const { init = {} } = request
  
  const temporaryDirectory = RuntimeEnvironment.get(EnvironmentKeyApiDirTemporary)

  const requestExt = requestExtension(request) 
  const extOk = isPopulatedString(requestExt) 
  console.log('fetchPromise REQUEST', url)

  return fetch(url, init).then(response => {
    const { body, headers } = response
    const mimetype = headers.get('content-type') || ''
    console.log('fetchPromise RESPONSE', mimetype)
    
    const mimeOk = isPopulatedString(mimetype) && mimetype.startsWith(type)
    const ext = (mimeOk && extOk) ? requestExt : temporaryExtension 
    const hash = requestArgsHash(request)
    const filePath = path.resolve(temporaryDirectory, urlFilename(hash, ext))
    const data = { filePath, mimetype, mimeOk, extOk }
    if (filePathExists(filePath)) return { data }

    console.log('fetchPromise WRITING', filePath)

    const stream = fs.createWriteStream(filePath, { flags: 'wx' })
    return finished(Readable.fromWeb(body as ReadableStream).pipe(stream)).then(() => {
      console.log('fetchPromise FINISHED', url)
      return { data }
    })
  
  }).catch(error => errorCaught(error))
}

function httpPromise(url: string, request: ServerMediaRequest, type: LoadType): Promise<StringDataOrError> {
  return fetchPromise(url, request, type).then(onError => {
    if (isDefiniteError(onError)) return onError

    const { data } = onError
    const { filePath, mimetype, mimeOk, extOk } = data
    if (mimeOk && extOk) {
      request.path = filePath
      return { data: filePath } as StringData
    }

    // console.log('httpPromise', data)

    // file was saved with temporary extension
    if (mimetype) {
      if (type === TypeFont) {
        const fileText = fileRead(filePath)
        // console.log('httpPromise', fileText)

        const url = urlFromCss(fileText)
        if (!url) return error(ERROR.Url, fileText)

        request.endpoint = url
        // const request: EndpointRequest = { endpoint: url }
        const event = new EventServerAssetPromise(request, TypeFont)
        MovieMasher.eventDispatcher.dispatch(event)
        const { promise } = event.detail
        if (!promise) return error(ERROR.Unimplemented, EventServerAssetPromise.Type)
        
        return promise
      }
    }
    return error(ERROR.Type)
  })
}
const handler = (event: EventServerAssetPromise) => {
  const { detail } = event
  const { request, loadType } = detail
  const { path } = request
  if (path) detail.promise = Promise.resolve({ data: path })
  else {
    const url = requestUrl(request)
    if (url.startsWith(ProtocolHttp)) {
      detail.promise = httpPromise(url, request, loadType)
    } else {
      const isFile = url.startsWith(ProtocolFile)
      const filePath = isFile ? url.slice(ProtocolFile.length) : url
      const absolutePath = pathResolvedToPrefix(filePath)
      // TODO: check if file exists and is in allowed directory

      request.path = absolutePath
      detail.promise = Promise.resolve({ data: absolutePath })
    } 
  }
  event.stopImmediatePropagation()

}

export const ServerAssetPromiseListeners = () => ({
  [EventServerAssetPromise.Type]: handler
})
