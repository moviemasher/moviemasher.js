import path from 'path'
import {
  Size, VideoOutputOptions, TypeAudio, TypeImage, TypeVideo 
} from "@moviemasher/lib-core"
import { expandFileOrScript } from '@moviemasher/server-core'

import { DataServerArgs } from "../Server/DataServer/DataServer"
import { FileServerArgs } from "../Server/FileServer/FileServer"
import { RenderingServerArgs } from "../Server/RenderingServer/RenderingServer"
import { ServerAuthentication } from "../Server/Server"
import { WebServerArgs } from "../Server/WebServer/WebServer"
import { HostOptions } from "./Host"
import { OutputOptionsRecord } from '../Server/RenderingServer/RenderingServerClass'

const OpenAuthentication: ServerAuthentication = { type: 'basic' }

export interface HostOptionsDefault {
  previewSize?: Size
  outputSize?: Size
  port?: number
  host?: string
  outputRate?: number
  auth?: ServerAuthentication
  temporaryDirectory?: string
  mediaDirectory?: string
  dataDirectory?: string
  dataMigrationsDirectory?: string
  renderingCacheDirectory?: string
  privateDirectory?: string
  publicDirectory?: string
  version?: string
  outputOptions?: OutputOptionsRecord
}

export const HostDefaultPort = 8570

export const HostDefaultOptions = (args: HostOptionsDefault = {}): HostOptions => {
  const {
    publicDirectory = "./packages/example/standalone/public",
    privateDirectory = "./packages/example/standalone/private",
    temporaryDirectory = './temporary', 
    dataMigrationsDirectory = "./dev/data-migrations", 
    dataDirectory,
    mediaDirectory,
    renderingCacheDirectory, 
    previewSize, outputSize, outputRate, port, auth, 
    host, version, outputOptions = {},
  } = args
  const definedHost = host || '0.0.0.0'
  const dbDirectory = dataDirectory || `${privateDirectory}/data`
  const cacheDirectory = renderingCacheDirectory || `${temporaryDirectory}/cache`
  const uploadDir = mediaDirectory || `${publicDirectory}/media`
  if (!uploadDir.startsWith(publicDirectory)) throw 'mediaDirectory must be public'

  const commandOutput: VideoOutputOptions = {}
  const basePort = port || HostDefaultPort
  if (outputSize) {
    const { width, height } = outputSize
    commandOutput.width = width
    commandOutput.height = height
  }
  if (outputRate) commandOutput.videoRate = outputRate


  const uploadsRelative = path.relative(publicDirectory, uploadDir)

  const authentication = auth || OpenAuthentication
  if (authentication.type === 'basic') {
    // support grabbing shared password from command or text file
    authentication.password = expandFileOrScript(authentication.password)
  }

  const data: DataServerArgs = {
    temporaryIdPrefix: 'temporary-',
    dbPath: `${dbDirectory}/sqlite.db`,
    dbMigrationsPrefix: dataMigrationsDirectory,
    authentication
  }

  const file: FileServerArgs = {
    uploadLimits: {
      video: 100,
      audio: 50,
      image: 5,
    },
    uploadsPrefix: uploadDir,
    uploadsRelative,
    extensions: {
      [TypeAudio]: [
        'aiff',
        'mp3',
      ],
      [TypeImage]: [
        'jpeg',
        'jpg',
        'png',
        'svg',
      ],

      [TypeVideo]: [
        'mov',
        'mp4',
        'mpeg',
        'mpg',
      ],
    },
    authentication
  }


  const rendering: RenderingServerArgs = {
    temporaryDirectory,
    cacheDirectory, authentication, outputOptions, previewSize, outputSize
  }


  const web: WebServerArgs = {
    sources: { '/': `${publicDirectory}/index.html` }, authentication
  }

  const options: HostOptions = {
    port: basePort, host: definedHost, version,
    corsOptions: { origin: "*" },
    data, file, rendering, web
  }

  return options
}
