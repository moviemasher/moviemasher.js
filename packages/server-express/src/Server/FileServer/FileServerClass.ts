import Express from "express"
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import basicAuth from 'express-basic-auth'
import {
  ApiCallback, UploadDescription, Endpoints, Errors, UploadTypes,
  FileStoreRequest, FileStoreResponse, JsonObject, LoadTypes, LoadType, assertPopulatedString,
} from "@moviemasher/moviemasher.js"

import { HostServers } from "../../Host/Host"
import { ServerHandler } from "../Server"
import { ServerClass } from "../ServerClass"
import { FileServer, FileServerArgs, FileServerFilename } from "./FileServer"


const FileServerMeg = 1024 * 1024


export class FileServerClass extends ServerClass implements FileServer {
  constructor(public args: FileServerArgs) { super(args) }

  constructCallback(uploadDescription: UploadDescription, userId: string, id: string): ApiCallback {
    const request: FileStoreRequest = { id }
    const callback: ApiCallback = {
      endpoint: { prefix: Endpoints.file.store },
      request: { body: request, headers: { "Content-Type": "multipart/form-data" } }
    }
    return callback
  }

  get extensions(): string[] {
    return Object.values(this.args.extensions).flat()
  }

  extensionLoadType(extension: string): LoadType | undefined {
    return UploadTypes.find(loadType =>
      this.args.extensions[loadType].includes(extension)
    )
  }

  id = 'file'

  init(userId: string): JsonObject {
    const prefix = `/${path.join(this.args.uploadsRelative, userId)}/`
    const { extensions, uploadLimits } = this.args
    return { prefix, extensions, uploadLimits }
  }

  property = 'file'

  startServer(app: Express.Application, activeServers: HostServers): void {
    super.startServer(app, activeServers)
    const fileSize = FileServerMeg * Math.max(...Object.values(this.args.uploadLimits))

    const { uploadsPrefix } = this.args
    const { extensions } = this

    const storage = multer.diskStorage({
      destination: function (req, _file, cb) {
        const { id } = req.body
        const request = req as basicAuth.IBasicAuthedRequest
        const { user } = request.auth
        if (!user) cb(new Error(Errors.invalid.user), '')
        else {
          const filePath = `${uploadsPrefix}/${user}/${id}`
          fs.mkdirSync(filePath, { recursive: true })
          cb(null, filePath)
        }
      },
      filename: function (_req, file, cb) {
        const { originalname } = file
        const ext = path.extname(originalname).slice(1).toLowerCase()
        if (!extensions.includes(ext)) cb(new Error(`Invalid extension ${ext}`), '')
        else cb(null, `${FileServerFilename}.${ext}`)
      }
    })
    const multerOptions = { storage, limits: { fileSize } }
    const upload = multer(multerOptions)
    app.post(Endpoints.file.store, upload.single(this.property), this.store)
  }

  store: ServerHandler<FileStoreResponse, FileStoreRequest> = async (req, res) => {
    const request = req.body
    const response: FileStoreResponse = {}
    try {
      const user = this.userFromRequest(req)
      if (user) {
        const { id } = request
        if (id) {
          const { file: uploadedFile} = req
          if (!uploadedFile) response.error = 'No file supplied'
        } else response.error = Errors.id
      } else response.error = Errors.invalid.user
    } catch (error) { response.error = String(error) }
    res.send(response)
  }

  userUploadPrefix(id: string, user?: string): string {
    assertPopulatedString(id, 'upload id')
    
    return id
  }

  withinLimits(size: number, type: string): boolean {
    if (!size) throw Errors.invalid.size
    if (!type) throw Errors.invalid.type

    const limit = this.args.uploadLimits[type]
    if (!limit) throw Errors.invalid.type

    return limit > size / FileServerMeg
  }
}
