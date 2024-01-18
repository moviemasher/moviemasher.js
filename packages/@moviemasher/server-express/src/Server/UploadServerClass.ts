import type { DropType, Strings } from '@moviemasher/shared-lib/types.js'
import type { Application } from 'express'
import type { UploadFileRequest, UploadFileResponse, UploadRequestRequest, UploadResponse, VersionedDataOrError } from '../Api/Api.js'
import type { ExpressHandler, UploadServerArgs } from './Server.js'

import { ENV_KEY, ENV, idUnique } from '@moviemasher/server-lib'
import { assertAboveZero, assertPopulatedString, } from '@moviemasher/shared-lib'
import { ASSET_TYPES, CONTENT_TYPE, DROP_TYPES, ERROR, MIME_MULTI, POST, SLASH, VERSION, errorMessageObject, errorObjectCaught, errorThrow, isDropType, isNumber, isString } from '@moviemasher/shared-lib/runtime.js'
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

  private extensionDropType(extension: string): DropType | undefined {
    const { extensions } = this.args
    const found = DROP_TYPES.find(type =>
      extensions[type].includes(extension)
    )
    console.log('UploadServerClass.extensionDropType', { extension, found })
    return found
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
    const id = idOrUndefined || idUnique() 
    console.log('UploadServerClass.upload', { id, name, size, type })
    try {
      const user = this.userFromRequest(req)
      console.log('UploadServerClass.upload', { user })

      const extension = path.extname(name).slice(1).toLowerCase()
      const mime = type.split(SLASH).shift() // audio, video, image, font
      console.log('UploadServerClass.upload', { extension, mime })
      if (!extension) {
        console.log('UploadServerClass.upload no extension', { mime })
        errorThrow(ERROR.ImportExtension)
      }

      if (!isDropType(mime)) {
        console.log('UploadServerClass.upload mime not drop type', { mime })
        errorThrow(ERROR.Unknown, mime)
      }


      const supportedType = this.extensionDropType(extension)
      console.log('UploadServerClass.upload', { supportedType })


      if (!supportedType) {
        console.log('UploadServerClass.upload no supportedType', { extension })
        errorThrow(ERROR.ImportExtension, extension)
      }
    
      if (!this.withinLimits(size, supportedType)) {
        errorThrow(ERROR.ImportSize, `${size} > ${this.args.uploadLimits[supportedType]}`)
      }
      const outputRoot = ENV.get(ENV_KEY.OutputRoot)
      const outputPath = path.resolve(outputRoot, user, id, `${FileServerFilename}.${extension}`)

      const endpoint = path.relative(ENV.get(ENV_KEY.RelativeRequestRoot), outputPath)
      const { fileProperty } = this
      const data = {
        id,
        storeRequest: {
          endpoint: { pathname: Endpoints.upload.file },
          init: { 
            method: POST, 
            headers: { [CONTENT_TYPE]: MIME_MULTI } 
          }, 
        },
        assetRequest: { endpoint },
        fileProperty
      }
      res.send({ version: VERSION, data })
    } catch (error) { 
      res.send({ version: VERSION, error: errorObjectCaught(error) })
    }   
  }

  override startServer(app: Application): Promise<void> {
    return super.startServer(app).then(() => {
      // console.debug(this.constructor.name, 'startServer')
      const fileSize = FileServerMeg * Math.max(...Object.values(this.args.uploadLimits).filter(isNumber))

      const outputRoot = ENV.get(ENV_KEY.OutputRoot)
      const { extensions } = this

      const storage = multer.diskStorage({
        destination: function (req, _file, cb) {
          const { id } = req.body
          const request = req as basicAuth.IBasicAuthedRequest
          const { user } = request.auth
          if (!user) cb(errorMessageObject(ERROR.ServerAuthentication), '')
          else {
            const filePath = path.resolve(outputRoot, `${user}/${id}`)
            fs.mkdirSync(filePath, { recursive: true })
            cb(null, filePath)
          }
        },
        filename: function (_req, file, cb) {
          const { originalname } = file
          const ext = path.extname(originalname).slice(1).toLowerCase()
          if (!extensions.includes(ext)) cb(errorMessageObject(`Invalid extension ${ext}`), '')
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
  
  private withinLimits(size: number, type: DropType): boolean {
    assertAboveZero(size)

    const limit = this.args.uploadLimits[type]
    assertAboveZero(limit)

    return limit > size / FileServerMeg
  }
}
