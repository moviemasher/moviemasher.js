import type { LoadType, PotentialError, Strings } from '@moviemasher/runtime-shared'
import type { FileStoreRequest, FileStoreResponse, FileUploadRequest, FileUploadResponse } from '../../Api/File.js'
import type { HostServers } from '../../Host/Host.js'
import type { ExpressHandler } from '../Server.js'

import { ContentTypeHeader, FormDataMimetype, SlashChar, assertAboveZero, assertPopulatedString, isLoadType, } from '@moviemasher/lib-shared'
import { ERROR, ASSET_TYPES, errorName, errorObject, errorObjectCaught, isNumber, isString } from '@moviemasher/runtime-shared'
import Express from 'express'
import basicAuth from 'express-basic-auth'
import fs from 'fs'
import multer from 'multer'
import path from 'path'
import { Endpoints } from '../../Api/Endpoints.js'
import { idUnique } from '../../Utilities/Id.js'
import { ServerClass } from '../ServerClass.js'
import { FileServer, FileServerArgs } from './FileServer.js'


const FileServerMeg = 1024 * 1024
const FileServerFilename = 'original'

export class FileServerClass extends ServerClass implements FileServer {
  constructor(public args: FileServerArgs) { super(args) }

  private get extensions(): Strings {
    return Object.values(this.args.extensions).flat().filter(isString)
  }

  private extensionLoadType(extension: string): LoadType | undefined {
    const found = ASSET_TYPES.find(loadType =>
      this.args.extensions[loadType].includes(extension)
    )
    if (found) return found as LoadType
  }

  id = 'file'

  private fileProperty = 'file'

  override startServer(app: Express.Application, activeServers: HostServers): Promise<void> {
    return super.startServer(app, activeServers).then(() => {
      console.debug(this.constructor.name, 'startServer')
      const fileSize = FileServerMeg * Math.max(...Object.values(this.args.uploadLimits).filter(isNumber))

      const { uploadsPrefix } = this.args
      const { extensions } = this

      const storage = multer.diskStorage({
        destination: function (req, _file, cb) {
          const { id } = req.body
          const request = req as basicAuth.IBasicAuthedRequest
          const { user } = request.auth
          if (!user) cb(errorObject(ERROR.ServerAuthentication), '')
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
      app.post(Endpoints.file.store, upload.single(this.fileProperty), this.store)
      app.post(Endpoints.file.upload, this.upload)
      return Promise.resolve()
    })
  }

  private store: ExpressHandler<FileStoreResponse | PotentialError, FileStoreRequest> = async (req, res) => {
    const request = req.body
    const response: FileStoreResponse = {}
    try {
      const user = this.userFromRequest(req)
      if (user) {
        const { id } = request
        if (id) {
          const { file: uploadedFile} = req
          if (!uploadedFile) response.error = errorName(ERROR.ServerAuthentication) 
        } else response.error = errorName(ERROR.ImportFile, 'No file supplied')
      } else response.error = errorName(ERROR.ServerAuthentication) 
    } catch (error) { response.error = errorObjectCaught(error) }
    res.send(response)
  }

  private upload: ExpressHandler<FileUploadResponse, FileUploadRequest> = async (req, res) => {
    const { id: idOrUndefined, name, size, type } = req.body
    console.log('FileServerClass.upload', { idOrUndefined, name, size, type })
    const id = idOrUndefined || idUnique() // new definition id
    const response: FileUploadResponse = {}
    try {
      const user = this.userFromRequest(req)
      const extension = path.extname(name).slice(1).toLowerCase()
      let raw: string | undefined = type.split(SlashChar).shift() // audio, video, image, font
      if (raw && !isLoadType(raw)) raw = ''
      raw ||= this.extensionLoadType(extension)

      if (!raw) response.error = errorName(ERROR.ImportType)
      else if (!this.withinLimits(size, raw)) {
        response.error = errorName(ERROR.ImportSize, { value: size }) 
      } else {
        const prefix = path.join(this.args.uploadsRelative, user, id)
        const source = path.join(prefix, `${FileServerFilename}.${extension}`)
        response.data = {
          id,
          storeRequest: {
            endpoint: { pathname: Endpoints.file.store },
            init: { 
              method: 'POST', 
              headers: { [ContentTypeHeader]: FormDataMimetype } 
            }, 
          },
          request: { endpoint: source },
          fileProperty: this.fileProperty
        }
      }
    } catch (error) { response.error = errorObjectCaught(error) }
    res.send(response)
  }

  private withinLimits(size: number, type: string): boolean {
    assertAboveZero(size)
    assertPopulatedString(type)

    const limit = this.args.uploadLimits[type]
    assertAboveZero(limit)

    return limit > size / FileServerMeg
  }
}
