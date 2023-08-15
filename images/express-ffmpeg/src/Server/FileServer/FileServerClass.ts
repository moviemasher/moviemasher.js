import type { JsonRecord, LoadType, Strings, } from '@moviemasher/runtime-shared'
import type { ApiCallback } from '../../Api/Api.js'
import type { FileStoreRequest, FileStoreResponse } from '../../Api/File.js'
import type { HostServers } from '../../Host/Host.js'
import type { ExpressHandler } from '../Server.js'

import { assertAboveZero, assertPopulatedString, } from '@moviemasher/lib-shared'
import { ErrorName, TypesAsset, errorName, errorObject, errorObjectCaught, isNumber, isString } from '@moviemasher/runtime-shared'
import Express from 'express'
import basicAuth from 'express-basic-auth'
import fs from 'fs'
import multer from 'multer'
import path from 'path'
import { Endpoints } from '../../Api/Endpoints.js'
import { ServerClass } from '../ServerClass.js'
import { FileServer, FileServerArgs, FileServerFilename, UploadDescription } from './FileServer.js'


const FileServerMeg = 1024 * 1024

export class FileServerClass extends ServerClass implements FileServer {
  constructor(public args: FileServerArgs) { super(args) }

  constructCallback(uploadDescription: UploadDescription, userId: string, id: string): ApiCallback {
    const request: FileStoreRequest = { id }
    const callback: ApiCallback = {
      endpoint: { pathname: Endpoints.file.store },
      init: { body: request, headers: { 'Content-Type': 'multipart/form-data' } }
    }
    return callback
  }

  get extensions(): Strings {
    return Object.values(this.args.extensions).flat().filter(isString)
  }

  extensionLoadType(extension: string): LoadType | undefined {
    const found = TypesAsset.find(loadType =>
      this.args.extensions[loadType].includes(extension)
    )
    if (found) return found as LoadType
  }

  id = 'file'

  init(userId: string): JsonRecord {
    const prefix = `/${path.join(this.args.uploadsRelative, userId)}/`
    const { extensions, uploadLimits } = this.args
    return { prefix, extensions, uploadLimits }
  }

  property = 'file'

  startServer(app: Express.Application, activeServers: HostServers): Promise<void> {
    super.startServer(app, activeServers)
    const fileSize = FileServerMeg * Math.max(...Object.values(this.args.uploadLimits).filter(isNumber))

    const { uploadsPrefix } = this.args
    const { extensions } = this

    const storage = multer.diskStorage({
      destination: function (req, _file, cb) {
        const { id } = req.body
        const request = req as basicAuth.IBasicAuthedRequest
        const { user } = request.auth
        if (!user) cb(errorObject(ErrorName.ServerAuthentication), '')
        else {
          const filePath = `${uploadsPrefix}/${user}/${id}`
          fs.mkdirSync(filePath, { recursive: true })
          cb(null, filePath)
        }
      },
      filename: function (_req, file, cb) {
        const { originalname } = file
        const ext = path.extname(originalname).slice(1).toLowerCase()
        if (!extensions.includes(ext)) cb(errorObject(`Invalid extension ${ext}`), '')
        else cb(null, `${FileServerFilename}.${ext}`)
      }
    })
    const multerOptions = { storage, limits: { fileSize } }
    const upload = multer(multerOptions)
    app.post(Endpoints.file.store, upload.single(this.property), this.store)
    return Promise.resolve()
  }

  store: ExpressHandler<FileStoreResponse, FileStoreRequest> = async (req, res) => {
    const request = req.body
    const response: FileStoreResponse = {}
    try {
      const user = this.userFromRequest(req)
      if (user) {
        const { id } = request
        if (id) {
          const { file: uploadedFile} = req
          if (!uploadedFile) response.error = errorName(ErrorName.ServerAuthentication) 
        } else response.error = errorName(ErrorName.ImportFile, 'No file supplied')
      } else response.error = errorName(ErrorName.ServerAuthentication) 
    } catch (error) { response.error = errorObjectCaught(error) }
    res.send(response)
  }

  userUploadPrefix(id: string, user?: string): string {
    assertPopulatedString(id, 'upload id')
    
    return id
  }

  withinLimits(size: number, type: string): boolean {
    assertAboveZero(size)
    assertPopulatedString(type)

    const limit = this.args.uploadLimits[type]
    assertAboveZero(limit)

    return limit > size / FileServerMeg
  }
}
