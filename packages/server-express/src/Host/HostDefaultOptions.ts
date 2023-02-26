import path from 'path'
import {
  Size, CommandOutput, AudioType, ImageType, VideoType 
} from "@moviemasher/moviemasher.js"
import { expandFileOrScript } from '@moviemasher/server-core'

import { DataServerArgs } from "../Server/DataServer/DataServer"
import { FileServerArgs } from "../Server/FileServer/FileServer"
import { RenderingServerArgs } from "../Server/RenderingServer/RenderingServer"
import { ServerAuthentication } from "../Server/Server"
import { WebServerArgs } from "../Server/WebServer/WebServer"
import { HostOptions } from "./Host"
import { RenderingCommandOutputRecord } from '../Server/RenderingServer/RenderingServerClass'

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
  renderingCommandOutputs?: RenderingCommandOutputRecord
}

export const HostDefaultPort = 8570

export const HostDefaultOptions = (args: HostOptionsDefault = {}): HostOptions => {
  const {
    publicDirectory = "./workspaces/example-standalone/public",
    privateDirectory = "./workspaces/example-standalone/private",
    temporaryDirectory = './temporary', 
    dataMigrationsDirectory = "./dev/data-migrations", 
    dataDirectory,
    mediaDirectory,
    renderingCacheDirectory, 
    previewSize, outputSize, outputRate, port, auth, 
    host, version, renderingCommandOutputs,
  } = args
  const definedHost = host || '0.0.0.0'
  const dbDirectory = dataDirectory || `${privateDirectory}/data`
  const cacheDirectory = renderingCacheDirectory || `${temporaryDirectory}/cache`
  const uploadDir = mediaDirectory || `${publicDirectory}/media`
  if (!uploadDir.startsWith(publicDirectory)) throw 'mediaDirectory must be public'

  const commandOutput: CommandOutput = {}
  const basePort = port || HostDefaultPort
  if (outputSize) {
    const { width, height } = outputSize
    commandOutput.width = width
    commandOutput.height = height
  }

  if (outputRate) commandOutput.videoRate = outputRate

  const commandOutputs: RenderingCommandOutputRecord = renderingCommandOutputs || {}

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
      [AudioType]: [
        'aiff',
        'mp3',
      ],
      [ImageType]: [
        'jpeg',
        'jpg',
        'png',
        'svg',
      ],

      [VideoType]: [
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
    cacheDirectory, authentication, commandOutputs, previewSize, outputSize
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
