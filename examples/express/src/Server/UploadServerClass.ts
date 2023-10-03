import type { LoadType, Strings } from '@moviemasher/runtime-shared'
import type { Application } from 'express'
import type { UploadFileRequest, UploadFileResponse, UploadRequestRequest, UploadResponse, VersionedDataOrError } from '../Api/Api.js'
import type { ExpressHandler, UploadServerArgs } from './Server.js'

import { ENV, ENVIRONMENT, idUnique } from '@moviemasher/lib-server'
import { ContentTypeHeader, FormDataMimetype, SLASH, assertAboveZero, assertPopulatedString, isLoadType, } from '@moviemasher/lib-shared'
import { ASSET_TYPES, ERROR, VERSION, errorObject, errorObjectCaught, errorThrow, isNumber, isString } from '@moviemasher/runtime-shared'
import basicAuth from 'express-basic-auth'
import fs from 'fs'
import multer from 'multer'
import path from 'path'
import { Endpoints } from '../Api/Endpoints.js'
import { ServerClass } from './ServerClass.js'

const FileServerMeg = 1024 * 1024
const FileServerFilename = 'original'

export class UploadServerClass extends ServerClass {
  constructor(public args: UploadServerArgs) { super(args) }

  private get extensions(): Strings {
    return Object.values(this.args.extensions).flat().filter(isString)
  }

  private extensionLoadType(extension: string): LoadType | undefined {
    const found = ASSET_TYPES.find(type =>
      this.args.extensions[type].includes(extension)
    )
    if (found) return found as LoadType
  }

  id = 'upload'

  private file: ExpressHandler<VersionedDataOrError<UploadFileResponse>, UploadFileRequest> = async (req, res) => {
    const request = req.body
    try {
      const user = this.userFromRequest(req)
      if (!user) errorThrow(ERROR.ServerAuthentication)

      const { id } = request
      if (!id) errorThrow(ERROR.Reference, 'No id supplied')
      
      const { file: uploadedFile} = req
      if (!uploadedFile) errorThrow(ERROR.ImportFile, 'No file supplied')

      res.send({ version: VERSION, data: { id } })
    } catch (error) { 
      res.send({ version: VERSION, error: errorObjectCaught(error) })
    }  
  }

  private fileProperty = 'file'

  private request: ExpressHandler<VersionedDataOrError<UploadResponse>, UploadRequestRequest> = async (req, res) => {
    const { id: idOrUndefined, name, size, type } = req.body
    console.log('FileServerClass.upload', { idOrUndefined, name, size, type })
    const id = idOrUndefined || idUnique() // new definition id
    try {
      const user = this.userFromRequest(req)
      const extension = path.extname(name).slice(1).toLowerCase()
      let raw: string | undefined = type.split(SLASH).shift() // audio, video, image, font
      if (raw && !isLoadType(raw)) raw = ''
      raw ||= this.extensionLoadType(extension)

      if (!raw) errorThrow(ERROR.ImportType)
      if (!this.withinLimits(size, raw)) {
        errorThrow(ERROR.ImportSize, `${size} > ${this.args.uploadLimits[raw]}`)
      }
      const outputRoot = ENVIRONMENT.get(ENV.OutputRoot)
      const endpoint = path.resolve(outputRoot, user, id, `${FileServerFilename}.${extension}`)
      const data = {
        id,
        storeRequest: {
          endpoint: { pathname: Endpoints.upload.file },
          init: { 
            method: 'POST', 
            headers: { [ContentTypeHeader]: FormDataMimetype } 
          }, 
        },
        assetRequest: { endpoint },
        fileProperty: this.fileProperty
      }
      res.send({ version: VERSION, data })
    } catch (error) { 
      res.send({ version: VERSION, error: errorObjectCaught(error) })
    }   
  }

  override startServer(app: Application): Promise<void> {
    return super.startServer(app).then(() => {
      console.debug(this.constructor.name, 'startServer')
      const fileSize = FileServerMeg * Math.max(...Object.values(this.args.uploadLimits).filter(isNumber))

      const outputRoot = ENVIRONMENT.get(ENV.OutputRoot)
      const { extensions } = this

      const storage = multer.diskStorage({
        destination: function (req, _file, cb) {
          const { id } = req.body
          const request = req as basicAuth.IBasicAuthedRequest
          const { user } = request.auth
          if (!user) cb(errorObject(ERROR.ServerAuthentication), '')
          else {
            const filePath = path.resolve(outputRoot, `${user}/${id}`)
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
      app.post(Endpoints.upload.file, upload.single(this.fileProperty), this.file)
      app.post(Endpoints.upload.request, this.request)
      return Promise.resolve()
    })
  }
  
  private withinLimits(size: number, type: string): boolean {
    assertAboveZero(size)
    assertPopulatedString(type)

    const limit = this.args.uploadLimits[type]
    assertAboveZero(limit)

    return limit > size / FileServerMeg
  }
}
