import type { ServerMediaRequest } from '@moviemasher/runtime-server'
import type { DataOrError, EndpointRequest, LoadType, StringData, StringDataOrError, Strings } from '@moviemasher/runtime-shared'

import { DOT, TextExtension, arrayUnique, assertDefined, assertRequest, requestUrl, urlFilename, urlFromCss, urlIsHttp } from '@moviemasher/lib-shared'
import { EventServerAssetPromise } from '@moviemasher/runtime-server'
import { ERROR, FONT, error, errorCaught, errorPromise, isDefiniteError, isPopulatedString, isString } from '@moviemasher/runtime-shared'
import fs from 'fs'
import path from 'path'
import { Readable } from 'stream'
import { finished } from 'stream/promises'
import { ReadableStream } from 'stream/web'
import { ENV, ENVIRONMENT } from '../Environment/EnvironmentConstants.js'
import { directoryCreatePromise, filePathExists, fileReadPromise } from '../Utility/File.js'
import { pathResolvedToPrefix, requestArgsHash } from '../Utility/Request.js'

const ProtocolFile = 'file'
const FetchPromises = new Map<string, Promise<DataOrError<FileAndMimetype>>>()


interface FileAndMimetype { 
  filePath: string
  mimetype: string 
  // mimeOk: boolean
  // extOk: boolean
}

const requestExtension = (request: EndpointRequest): string => {
  const { endpoint } = request
  assertDefined(endpoint)
  
  const pathname = isString(endpoint) ? endpoint : endpoint.pathname || ''
  const fileName = path.basename(pathname)
  const extension = path.extname(fileName)
  // const last = fileName.split(DOT).pop() || ''
  return extension.trim()
}

const requestFilePath = (request: EndpointRequest): string => {
  const requestExt = requestExtension(request) 
  const extOk = isPopulatedString(requestExt) 
  const ext = extOk ? requestExt : TextExtension 
  const hash = requestArgsHash(request)
  return path.resolve(ENVIRONMENT.get(ENV.ApiDirCache), urlFilename(hash, ext))
}

const fetchPromise = (url: string, filePath: string, type: LoadType, init: RequestInit = {}): Promise<DataOrError<FileAndMimetype>> => {
  
  const existing = FetchPromises.get(filePath)
  if (existing) {
    // console.log('fetchPromise EXISTING', filePath)
    return existing
  }
  

  
  // const { init = {} } = request
  // const requestExt = requestExtension(request) 
  // const extOk = isPopulatedString(requestExt) 

  // if (filePathExists(filePath)) {
  //   request.path = filePath
  // }

  // console.log('fetchPromise REQUEST', url)
  const parentDir = path.dirname(filePath)

  // console.log('fetchPromise CREATING', parentDir)
  const dirPromise = directoryCreatePromise(parentDir)

  const promise = dirPromise.then(orError => {
    if (isDefiniteError(orError)) return orError

    return fetch(url, init).then(response => {
      const { body, headers } = response
      if (!body) return error(ERROR.Url, `fetchPromise NO BODY ${url}`)
      
      const mimetype = headers.get('content-type') || ''
      // console.log('fetchPromise RESPONSE', mimetype)
      
      // const mimeOk = isPopulatedString(mimetype) && mimetype.startsWith(type)
      // const ext = (mimeOk && extOk) ? requestExt : TextExtension 
      const data: FileAndMimetype = { filePath, mimetype }
      if (filePathExists(filePath)) {
        // console.log('fetchPromise FOUND', filePath)
        body?.cancel()
        return { data }
      }

      const stream = fs.createWriteStream(filePath)
      const writeStream = Readable.fromWeb(body as ReadableStream).pipe(stream)
      // console.log('fetchPromise WRITING', filePath)
      return finished(writeStream).then(() => {
        // console.log('fetchPromise FINISHED', url)
        return { data }
      }).catch(error => {
        // console.log('fetchPromise ERROR', filePath, error)
        return errorCaught(error)
      })
    })
  }).then(orError => {
    // console.log('fetchPromise DONE', filePath)

    FetchPromises.delete(filePath)
    return orError
  })

  FetchPromises.set(filePath, promise)
  return promise
}

const resolvedRequest = (request: ServerMediaRequest): StringData | undefined => {
  const { path } = request
  if (path) return { data: path }
  return 
}


const httpPromise = (url: string, request: ServerMediaRequest, type: LoadType): Promise<StringDataOrError> => {
  return new Promise<StringDataOrError>(resolve => {
    const resolved = resolvedRequest(request)
    if (resolved) {
      resolve(resolved)
      return 
    }
    const requestExt = requestExtension(request) 
    const extOk = isPopulatedString(requestExt) 
    const filePath = requestFilePath(request)
    // console.log('httpPromise', { url, filePath, type, requestExt, extOk })
      // const ext = (mimeOk && extOk) ? requestExt : TextExtension 
    const fetching = fetchPromise(url, filePath, type, request.init).then(orError => {
      // console.log('httpPromise FETCHED', url, orError)
      if (isDefiniteError(orError)) return orError

      const { filePath, mimetype } = orError.data
      if (!mimetype) return error(ERROR.Url, `httpPromise NO MIME for ${url}`)

      if (extOk && mimetype.startsWith(type)) {
        request.path = filePath
        return orError
      }
      
      if (type !== FONT) return error(ERROR.Type, `httpPromise ${type} ${mimetype} ${url}`)
      
      return fileReadPromise(filePath).then(orError => {
        if (isDefiniteError(orError)) return orError

        const { data: fileText } = orError
        if (!fileText) {

          // throw(`httpPromise EMPTY ${url} ${filePath}`)
          return error(ERROR.Url, `httpPromise font ${filePath}`)
        }
        // console.log('httpPromise', fileText)

        const cssUrl = urlFromCss(fileText)
        if (!urlIsHttp(cssUrl)) return error(ERROR.Url, `httpPromise CSS ${fileText}`)

        request.endpoint = cssUrl
        const cssFilePath = requestFilePath(request)
        return fetchPromise(cssUrl, cssFilePath, FONT, request.init)
      })
    })
    return fetching.then(orError => {
      if (isDefiniteError(orError)) return orError

      const { path: data = filePath } = request

      resolve({ data })
    })
  })
}

const isInValidDirectory = (absolutePath: string, validDirectories: Strings = []): boolean => {
  // const dirFilePrefix = ENVIRONMENT.get(ENV.ApiDirFilePrefix)
  const dirValid = ENVIRONMENT.getArray(ENV.ApiDirValid)
  const relative = [...dirValid, ...validDirectories]
  const absolute = relative.map(valid => pathResolvedToPrefix(valid))
  const unique = arrayUnique(absolute)
  const valid = unique.some(valid => absolutePath.startsWith(valid)) 
  if (!valid) console.log('isInValidDirectory', { absolutePath, absolute})
  return valid
}

const handler = (event: EventServerAssetPromise) => {
  const { detail } = event
  const { request, loadType, validDirectories } = detail
  assertRequest(request)
  
  const { path } = request
  if (path) {
    detail.promise = Promise.resolve({ data: path })
    // console.log(EventServerAssetPromise.Type, 'path existed', path)
  } else {
    const url = requestUrl(request)
    if (urlIsHttp(url)) {
      // console.log(EventServerAssetPromise.Type, 'no path for HTTP', url)
      detail.promise = httpPromise(url, request, loadType).catch(err => {
        // console.log('httpPromise', err)
        return errorCaught(err)
      })
    } else {
      const isFile = url.startsWith(ProtocolFile)
      const filePath = isFile ? url.slice(ProtocolFile.length + 3) : url
      const absolutePath = pathResolvedToPrefix(filePath)

      const exists = filePathExists(absolutePath)
      const isValid = exists && isInValidDirectory(absolutePath, validDirectories)
      if (!isValid) {
        detail.promise = errorPromise(ERROR.ServerAuthorization, `${exists} ${url}`)
      } else {
        request.path = absolutePath
        detail.promise = Promise.resolve({ data: absolutePath })
      }
    } 
  }
  event.stopImmediatePropagation()
}

export const ServerAssetPromiseListeners = () => ({
  [EventServerAssetPromise.Type]: handler
})
