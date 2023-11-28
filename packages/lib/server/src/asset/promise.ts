import type { ServerMediaRequest } from '@moviemasher/runtime-server'
import type { DataOrError, EndpointRequest, ImportType, ListenersFunction, StringData, StringDataOrError, Strings } from '@moviemasher/runtime-shared'

import { assertDefined } from '@moviemasher/lib-shared/utility/guards.js'
import { requestUrl, urlFromCss } from '@moviemasher/lib-shared/utility/request.js'
import { EventServerAssetPromise } from '@moviemasher/runtime-server'
import { COLON, DOT, ERROR, FONT, HTTP, HTTPS, SLASH, TXT, arrayUnique, errorCaught, errorPromise, isDefiniteError, isPopulatedString, isString, jsonStringify, namedError } from '@moviemasher/runtime-shared'
import fs from 'fs'
import path from 'path'
import { Readable } from 'stream'
import { finished } from 'stream/promises'
import { ReadableStream } from 'stream/web'
import { ENV_KEY, ENV } from '../Environment/EnvironmentConstants.js'
import { directoryCreatePromise, filePathExists, fileReadPromise } from '../Utility/File.js'
import { fileNameFromContent } from '../Utility/File.js'


const ProtocolSuffix = [COLON, SLASH, SLASH].join('')

const ProtocolFile = 'file'
const FetchPromises = new Map<string, Promise<DataOrError<FileAndMimetype>>>()

const requestArgsHash = (args: any): string => fileNameFromContent(jsonStringify(args))

const pathResolvedToPrefix = (url: string, prefix?: string): string => (
  path.resolve(prefix || ENV.get(ENV_KEY.ExampleRoot), url)
)

const urlExtension = (extension: string): string => (
  (extension[0] === DOT) ? extension.slice(1) : extension
)

const urlFilename = (name: string, extension: string): string =>(
  `${name}.${urlExtension(extension)}`
)


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
  const ext = extOk ? requestExt : TXT 
  const hash = requestArgsHash(request)
  return path.resolve(ENV.get(ENV_KEY.ApiDirCache), urlFilename(hash, ext))
}

const fetchPromise = (url: string, filePath: string, init: RequestInit = {}): Promise<DataOrError<FileAndMimetype>> => {
  
  const existing = FetchPromises.get(filePath)
  if (existing) {
    // console.log('fetchPromise EXISTING', filePath)
    return existing
  }
  
  const parentDir = path.dirname(filePath)

  // console.log('fetchPromise CREATING', parentDir)
  const dirPromise = directoryCreatePromise(parentDir)

  const promise = dirPromise.then(orError => {
    if (isDefiniteError(orError)) return orError

    return fetch(url, init).then(response => {
      const { body, headers } = response
      if (!body) return namedError(ERROR.Url, `fetchPromise NO BODY ${url}`)
      
      const mimetype = headers.get('content-type') || ''
      // console.log('fetchPromise RESPONSE', mimetype)
      
      // const mimeOk = isPopulatedString(mimetype) && mimetype.startsWith(type)
      // const ext = (mimeOk && extOk) ? requestExt : TXT 
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
        // console.log('fetchPromise finished', url)
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

export const urlIsHttp = (url: string) => (
  url.startsWith(`${HTTP}${ProtocolSuffix}`) 
  || url.startsWith(`${HTTPS}${ProtocolSuffix}`) 
)

const httpPromise = (url: string, request: ServerMediaRequest, type: ImportType): Promise<StringDataOrError> => {
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
      // const ext = (mimeOk && extOk) ? requestExt : TXT 
    const fetching = fetchPromise(url, filePath, request.init).then(orError => {
      // console.log('httpPromise FETCHED', url, orError)
      if (isDefiniteError(orError)) return orError

      const { filePath, mimetype } = orError.data
      if (!mimetype) return namedError(ERROR.Url, `httpPromise NO MIME for ${url}`)

      if (extOk && mimetype.startsWith(type)) {
        request.path = filePath
        return orError
      }
      
      if (type !== FONT) return namedError(ERROR.Type, `httpPromise ${type} ${mimetype} ${url}`)
      
      return fileReadPromise(filePath).then(orError => {
        if (isDefiniteError(orError)) return orError

        const { data: fileText } = orError
        if (!fileText) {

          // throw(`httpPromise EMPTY ${url} ${filePath}`)
          return namedError(ERROR.Url, `httpPromise font ${filePath}`)
        }
        // console.log('httpPromise', fileText)

        const cssUrl = urlFromCss(fileText)
        if (!urlIsHttp(cssUrl)) return namedError(ERROR.Url, `httpPromise CSS ${fileText}`)

        request.endpoint = cssUrl
        const cssFilePath = requestFilePath(request)
        return fetchPromise(cssUrl, cssFilePath, request.init)
      })
    })
    return fetching.then(orError => {
      if (isDefiniteError(orError)) return orError

      const { path: data = filePath } = request

      resolve({ data })
    })
  })
}

const isValidDirectory = (absolutePath: string, validDirectories: Strings = []): boolean => {
  const dirValid = ENV.getArray(ENV_KEY.ApiDirValid)
  const relative = [...dirValid, ...validDirectories]
  const absolute = relative.map(valid => pathResolvedToPrefix(valid))
  const unique = arrayUnique(absolute)
  const valid = unique.some(valid => absolutePath.startsWith(valid)) 
  if (!valid) console.log('isValidDirectory', { valid, absolutePath, unique })
  return valid
}

const handler = (event: EventServerAssetPromise) => {
  const { detail } = event
  const { request, importType, validDirectories } = detail  
  const { path } = request
  if (path) {
    detail.promise = Promise.resolve({ data: path })
  } else {
    const url = requestUrl(request)
    if (urlIsHttp(url)) {
      detail.promise = httpPromise(url, request, importType).catch(err => {
        return errorCaught(err)
      })
    } else {
      const isFile = url.startsWith(ProtocolFile)
      const filePath = isFile ? url.slice(ProtocolFile.length + 3) : url
      const absolutePath = pathResolvedToPrefix(filePath)

      const exists = filePathExists(absolutePath)
      const isValid = exists && isValidDirectory(absolutePath, validDirectories)
      if (!isValid) {
        console.log('EventServerAssetPromise NOT VALID', { absolutePath, exists, isValid })
        detail.promise = errorPromise(ERROR.ServerAuthorization, `exists: ${exists} url: ${url}`)
      } else {
        request.path = absolutePath
        detail.promise = Promise.resolve({ data: absolutePath })
      }
    } 
  }
  event.stopImmediatePropagation()
}

export const ServerAssetPromiseListeners: ListenersFunction = () => ({
  [EventServerAssetPromise.Type]: handler
})
