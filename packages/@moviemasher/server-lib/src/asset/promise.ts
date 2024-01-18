import type { AbsolutePath, Data, DataOrError, DropType, EndpointRequest, ListenersFunction, Mimetype, ServerMediaRequest, StringDataOrError, Strings } from '@moviemasher/shared-lib/types.js'
import type { PathAndType } from '../types.js'

import { COLON, DOT, ERROR, FONT, HTTP, HTTPS, IMAGE, SLASH, TXT, VIDEO, arrayUnique, errorCaught, errorPromise, isDefiniteError, isDropType, isMimetype, isPopulatedString, isString, jsonStringify, mimeDropType, namedError } from '@moviemasher/shared-lib/runtime.js'
import { assertDefined } from '@moviemasher/shared-lib/utility/guards.js'
import { requestUrl, urlFromCss } from '@moviemasher/shared-lib/utility/request.js'
import fs from 'fs'
import path from 'path'
import { Readable } from 'stream'
import { finished } from 'stream/promises'
import { ReadableStream } from 'stream/web'
import { EventServerMediaPromise, assertAbsolutePath, assertMimetype } from '../runtime.js'
import { ENV, ENV_KEY } from '../utility/EnvironmentConstants.js'
import { directoryCreatePromise, fileNameFromContent, filePathExists, fileReadPromise, fileWritePromise } from '../utility/File.js'

const MIME = 'mime'

const ProtocolSuffix = [COLON, SLASH, SLASH].join('')

const ProtocolFile = 'file'
const FetchPromises = new Map<string, Promise<DataOrError<PathAndType>>>()

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

const requestFilePath = (request: EndpointRequest): AbsolutePath => {
  const requestExt = requestExtension(request) 
  const ext = isPopulatedString(requestExt) ? requestExt : TXT 
  const hash = requestArgsHash(request)
  const filePath = path.resolve(ENV.get(ENV_KEY.ApiDirCache), urlFilename(hash, ext))
  assertAbsolutePath(filePath)
  return filePath
}

const dataPromise = async (filePath: AbsolutePath, type: Mimetype): Promise<StringDataOrError> => {

  try {
    const res = await fs.promises.readFile(filePath)
    const buffer = Buffer.from(res.buffer)

    const base64 = buffer.toString('base64')
    return { data: `data:${type};base64,${base64}` }

  } catch (error) { return errorCaught(error) }


  // const dataOrError = await fileReadPromise(filePath)
  // if (isDefiniteError(dataOrError)) return dataOrError

  // const buffer = Buffer.from(dataOrError.data)
}

const imageMimetype = (filePath: AbsolutePath): Mimetype => {
  const ext = path.extname(filePath).slice(1)
  switch(ext) {
    case 'jpg': return `${IMAGE}/jpeg`
    default: return `${IMAGE}/${ext}`
  }
}

const fetchPromise = async (url: string, filePath: AbsolutePath, request: ServerMediaRequest): Promise<DataOrError<PathAndType>> => {
  const { init } = request
  const requesting = FetchPromises.get(filePath)
  if (requesting) return requesting

  const typePath = [filePath, MIME].join(DOT)

  if (filePathExists(filePath)) {
    if (filePathExists(typePath)) {
      const typeOrError = await fileReadPromise(typePath)
      if (isDefiniteError(typeOrError)) return typeOrError

      const { data: type } = typeOrError
      if (isDropType(type) || isMimetype(type)) {
        request.path = filePath
        request.type = type
        if (type === IMAGE) {
          const mimetype = isMimetype(type) ? type : imageMimetype(filePath)
          const dataOrError = await dataPromise(filePath, mimetype)
          if (isDefiniteError(dataOrError)) return dataOrError

          request.dataUrl = dataOrError.data
        }
        return { data: { path: filePath, type } }
      }
    }
  }

  const promise = directoryCreatePromise(path.dirname(filePath)).then(orError => {
    if (isDefiniteError(orError)) return orError

    return fetch(url, init).then(response => {
      const { body, headers } = response
      if (!body) return namedError(ERROR.Url, `fetchPromise NO BODY ${url}`)
      
      const mimetype = headers.get('content-type') 
      assertMimetype(mimetype)

      const type = mimeDropType(mimetype) || mimetype
      const data: PathAndType = { path: filePath, type }
      const stream = fs.createWriteStream(filePath)
      const writeStream = Readable.fromWeb(body as ReadableStream).pipe(stream)
      return finished(writeStream).then(() => {
        // console.log('fetchPromise finished', { filePath, type }, isDropType(type))
        return fileWritePromise(typePath, type).then(orError => {
          request.path = filePath
          request.type = type
          if (type === IMAGE) {
            return dataPromise(filePath, mimetype).then(dataOrError => {
              if (isDefiniteError(dataOrError)) return dataOrError
    
              request.dataUrl = dataOrError.data
              return { data }
            })
          }
          return isDefiniteError(orError) ? orError : { data }
        })
      }).catch(error => { return errorCaught(error) })
    })
  }).then(orError => {
    FetchPromises.delete(filePath)
    return orError
  })

  FetchPromises.set(filePath, promise)
  return promise
}

const resolvedRequest = (request: ServerMediaRequest): Data<PathAndType> | undefined => {
  const { path, type } = request
  if (path && type) return { data: { path, type } }
}

export const urlIsHttp = (url: string) => (
  url.startsWith(`${HTTP}${ProtocolSuffix}`) 
  || url.startsWith(`${HTTPS}${ProtocolSuffix}`) 
)

const httpPromise = (url: string, request: ServerMediaRequest, dropType?: DropType): Promise<DataOrError<PathAndType>> => {
  return new Promise<DataOrError<PathAndType>>(resolve => {
    const requestResolved = resolvedRequest(request)
    if (requestResolved) {
      resolve(requestResolved)
      return 
    }
    const requestExt = requestExtension(request) 
    const extOk = isPopulatedString(requestExt) 
    const filePath = requestFilePath(request)
    const fetching = fetchPromise(url, filePath, request).then(orError => {
      if (isDefiniteError(orError)) return orError

      const { data: pathAndType } = orError
      const { path: filePath, type } = pathAndType
      if (extOk && (!dropType || type === dropType)) {
        return orError
      }
      if (dropType !== FONT) return namedError(ERROR.Type, `httpPromise ${dropType} ${type} ${url}`)
      
      return fileReadPromise(filePath).then(orError => {
        if (isDefiniteError(orError)) return orError

        const { data: fileText } = orError
        if (!fileText) {
          return namedError(ERROR.Url, `httpPromise font ${filePath}`)
        }
        const cssUrl = urlFromCss(fileText)
        if (!urlIsHttp(cssUrl)) return namedError(ERROR.Url, `httpPromise CSS ${fileText}`)

        request.endpoint = cssUrl
        const cssFilePath = requestFilePath(request)
        return fetchPromise(cssUrl, cssFilePath, request)
      })
    })
    return fetching.then(orError => {
      if (isDefiniteError(orError)) return orError

      const requestResolved = resolvedRequest(request)
      if (requestResolved) {
        resolve(requestResolved)
        return 
      }
      else console.log('httpPromise NOT RESOLVED', { request })
      resolve(namedError(ERROR.Url, url))
    })
  })
}

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

const handler = (event: EventServerMediaPromise) => {
  const { detail } = event
  const { request, dropType, validDirectories } = detail  
  const requestResolved = resolvedRequest(request) 
  if (requestResolved) detail.promise = Promise.resolve(requestResolved)
  else {
    const url = requestUrl(request)
    if (urlIsHttp(url)) {
      detail.promise = httpPromise(url, request, dropType).catch(errorCaught)
    } else {
      const isFile = url.startsWith(ProtocolFile)
      const filePath = isFile ? url.slice(ProtocolFile.length + 3) : url
      const absolutePath = pathResolvedToPrefix(filePath)
      const exists = filePathExists(absolutePath)
      const isValid = exists && isValidDirectory(absolutePath, validDirectories)
      if (!isValid) {
        console.log('EventServerMediaPromise NOT VALID', { absolutePath, exists, isValid })
        detail.promise = errorPromise(ERROR.ServerAuthorization, url)
      } else {
        request.path = absolutePath
        request.type = dropType 
        const fileResolved = resolvedRequest(request)
        assertDefined(fileResolved)

        if (dropType === IMAGE) {
          const mimetype = imageMimetype(absolutePath)
          detail.promise = dataPromise(absolutePath, mimetype).then(dataOrError => {
          
            if (isDefiniteError(dataOrError)) return dataOrError

            request.dataUrl = dataOrError.data
            return fileResolved
          })

        } else detail.promise = Promise.resolve(fileResolved)
      }
    } 
  }
  event.stopImmediatePropagation()
}

export const ServerAssetPromiseListeners: ListenersFunction = () => ({
  [EventServerMediaPromise.Type]: handler
})
