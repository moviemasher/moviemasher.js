import type { AbsolutePath, AbsolutePaths, EndpointRequest, RetrieveFunction, PromiseFunction, Resource, StringData, StringDataOrError, Strings } from '@moviemasher/shared-lib/types.js'

import { $HTTP, $HTTPS, $TTF, $TXT, $WOFF2, COLON, DOT, ERROR, SLASH, arrayUnique, errorCaught, errorPromise, isDefiniteError, jsonStringify, namedError } from '@moviemasher/shared-lib/runtime.js'
import { isPopulatedString, isString } from '@moviemasher/shared-lib/utility/guard.js'
import { assertDefined } from '@moviemasher/shared-lib/utility/guards.js'
import { requestUrl } from '@moviemasher/shared-lib/utility/request.js'
import fs from 'fs'
import path from 'path'
import { Readable } from 'stream'
import { finished } from 'stream/promises'
import { ReadableStream } from 'stream/web'
import { assertAbsolutePath } from '../utility/guard.js'
import { ENV, ENV_KEY } from '../utility/env.js'
import { directoryCreatePromise, fileCopyPromise, fileNameFromContent, filePathExists } from './file-write.js'

const ProtocolSuffix = [COLON, SLASH, SLASH].join('')

const ProtocolFile = 'file'
const FetchingPromises = new Map<string, Promise<StringDataOrError>>()

const requestArgsHash = (args: any): string => fileNameFromContent(jsonStringify(args))

const pathResolvedToPrefix = (url: string, prefix?: string): AbsolutePath => {
  const root = prefix || ENV.get(ENV_KEY.RelativeRequestRoot)
  const absolutePath = path.resolve(root, url)
  assertAbsolutePath(absolutePath)

  return absolutePath
}

const urlExtension = (extension: string): string => (
  (extension[0] === DOT) ? extension.slice(1) : extension
)

const urlFilename = (name: string, extension: string): string =>(
  `${name}.${urlExtension(extension)}`
)

const requestExtension = (request: EndpointRequest): string => {
  const { endpoint } = request
  assertDefined(endpoint)
  
  const pathname = isString(endpoint) ? endpoint : endpoint.pathname || ''
  const fileName = path.basename(pathname)
  const extension = path.extname(fileName)
  return extension.trim()
}

const requestFilePath = (request: EndpointRequest, type: string = $TXT ): AbsolutePath => {
  const requestExt = requestExtension(request) 
  const ext = isPopulatedString(requestExt) ? requestExt : type
  const hash = requestArgsHash(request)
  const filePath = path.resolve(ENV.get(ENV_KEY.ApiDirCache), urlFilename(hash, ext))
  assertAbsolutePath(filePath)
  return filePath
}

const fetchUrlPromise = (url: string, request: EndpointRequest, dropType: string): Promise<StringDataOrError> => {
  const filePath = requestFilePath(request, dropType)
  const result = { data: filePath }
  if (filePathExists(filePath)) {
    request.path = filePath
    return Promise.resolve(result)
  }
  const fetching = FetchingPromises.get(filePath)
  if (fetching) return fetching

  const promise = directoryCreatePromise(path.dirname(filePath)).then(dirOrError => {
    if (isDefiniteError(dirOrError)) return dirOrError
    
    const { init } = request
    return fetch(url, init).then(response => {
      const { body } = response
      if (!body) return namedError(ERROR.Url, `fetchPromise NO BODY ${url}`)
      
      const stream = fs.createWriteStream(filePath)
      const writeStream = Readable.fromWeb(body as ReadableStream).pipe(stream)
      return finished(writeStream).then(() => result).catch(error => { return errorCaught(error) })
    }).catch(error => { return errorCaught(error) })
  }).then(orError => {
    FetchingPromises.delete(filePath)
    if (!isDefiniteError(orError)) request.path = filePath
    return orError
  })
  FetchingPromises.set(filePath, promise)
  return promise
}

const requestResolved = (request: EndpointRequest): StringData | undefined => {
  const { path } = request
  if (path) return { data:  path } 
}

export const urlIsHttp = (url: string) => (
  url.startsWith(`${$HTTP}${ProtocolSuffix}`) 
  || url.startsWith(`${$HTTPS}${ProtocolSuffix}`) 
)

const isValidDirectory = (absolutePath: string, validDirectories: Strings = []): boolean => {
  const dirValid = ENV.getArray(ENV_KEY.ApiDirValid)
  const outputDir = ENV.get(ENV_KEY.OutputRoot)
  const relative = [outputDir, ...dirValid, ...validDirectories]
  const absolute = relative.map(valid => pathResolvedToPrefix(valid))
  
  const unique = arrayUnique(absolute)
  const valid = unique.some(valid => absolutePath.startsWith(valid)) 
  if (!valid) console.log('isValidDirectory', { valid, absolutePath, unique })
  return valid
}

const localPromise = (url: string, request: EndpointRequest, validDirectories: AbsolutePaths = []): Promise<StringDataOrError> => {
  const isFile = url.startsWith(ProtocolFile)
  const filePath = isFile ? url.slice(ProtocolFile.length + 3) : url
  const absolutePath = pathResolvedToPrefix(filePath)
  const exists = filePathExists(absolutePath)
  const isValid = exists && isValidDirectory(absolutePath, validDirectories)
  if (!isValid) {
    console.log('localPromise NOT VALID', { absolutePath, exists, isValid })
    return errorPromise(ERROR.ServerAuthorization, url)
  } 
  request.path = absolutePath
  return Promise.resolve({ data: absolutePath })
}

const retrieveRequestPromise = (request: EndpointRequest, type: string, validDirectories?: AbsolutePaths): Promise<StringDataOrError> => {

  const url = requestUrl(request)
  if (urlIsHttp(url)) return fetchUrlPromise(url, request, type)
  return localPromise(url, request, validDirectories)
}

const fetchRequestPromise = (request: EndpointRequest, type: string, validDirectories?: AbsolutePaths): Promise<StringDataOrError> => {
  const resolved = requestResolved(request)
  if (resolved) return Promise.resolve(resolved)

  const promise =  retrieveRequestPromise(request, type, validDirectories)
  if (!(type === $TTF || type === $WOFF2)) return promise
  
  return promise.then(orError => {
    if (isDefiniteError(orError)) return orError
    
    const { data: filePath } = orError
    if (!filePath) return namedError(ERROR.Unavailable, type)

    const ttfFile = path.join(ENV.get(ENV_KEY.FontDir), path.basename(filePath))
    return fileCopyPromise(filePath, ttfFile).then(copyOrError => (
      isDefiniteError(copyOrError) ? copyOrError : { data: ttfFile }
    ))
  })
}

export const serverRetrieveFunction: RetrieveFunction = (resource, options = {}): Promise<StringDataOrError> => {
  const { request, type } = resource
  const { validDirectories } = options
  return fetchRequestPromise(request, type, validDirectories)
}
