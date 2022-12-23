import path from 'path'
import {
  ExtDash, ExtRtmp, ExtHls, ExtTs, StreamingFormat,
  outputDefaultDash, outputDefaultRtmp, outputDefaultHls, CommandOutput, LoadType, Size
} from "@moviemasher/moviemasher.js"
import { expandFileOrScript } from '@moviemasher/server-core'

import { ApiServerArgs } from "../Server/ApiServer/ApiServer"
import { DataServerArgs } from "../Server/DataServer/DataServer"
import { FileServerArgs } from "../Server/FileServer/FileServer"
import { RenderingCommandOutputs, RenderingServerArgs } from "../Server/RenderingServer/RenderingServer"
import { ServerAuthentication } from "../Server/Server"
import { StreamingFormatOptions, StreamingServerArgs } from "../Server/StreamingServer/StreamingServer"
import { WebServerArgs } from "../Server/WebServer/WebServer"
import { HostOptions } from "./Host"

const OpenAuthentication: ServerAuthentication = { type: 'basic' }

export interface HostOptionsDefault {
  previewSize?: Size
  outputSize?: Size
  port?: number
  host?: string
  outputRate?: number
  auth?: ServerAuthentication
  temporaryDirectory?: string
  fileUploadDirectory?: string
  dataMigrationsDirectory?: string
  renderingCacheDirectory?: string
  dataBaseFile?: string
  webServerHome?: string
  version?: string
  renderingCommandOutputs?: RenderingCommandOutputs
}

export const HostDefaultPort = 8570
export const HostDefaultOptions = (args: HostOptionsDefault = {}): HostOptions => {
  const {
    previewSize, outputSize,
    outputRate,
    port, auth, webServerHome,
    temporaryDirectory, fileUploadDirectory,
    dataMigrationsDirectory, dataBaseFile,
    renderingCacheDirectory, host, version, renderingCommandOutputs,
  } = args
  const definedHost = host || '0.0.0.0'
  const commandOutput: CommandOutput = {}
  const basePort = port || HostDefaultPort
  if (outputSize) {
    const { width, height } = outputSize
    commandOutput.width = width
    commandOutput.height = height
  }

  if (outputRate) commandOutput.videoRate = outputRate
  const temporary = temporaryDirectory || './temporary'
  const cacheDirectory = renderingCacheDirectory || `${temporary}/cache`
  const migrations = dataMigrationsDirectory || "./workspaces/example-express-react/host/data-migrations"
  const home = webServerHome || "./workspaces/example-express-react/host/public/index.html"
  const homeDirectory = path.dirname(home)
  const baseFile = dataBaseFile || `${path.dirname(migrations)}/sqlite.db`
  const upload = fileUploadDirectory || `${homeDirectory}/media`
  const commandOutputs: RenderingCommandOutputs = renderingCommandOutputs || {}

  if (!upload.startsWith(homeDirectory)) throw 'fileUploadDirectory must be under webServerHome'

  const uploadsRelative = path.relative(homeDirectory, upload)

  const authentication = auth || OpenAuthentication
  if (authentication.type === 'basic') {
    // support grabbing shared password from command or text file
    authentication.password = expandFileOrScript(authentication.password)
  }
  const api: ApiServerArgs = {
    authentication
  }
  const data: DataServerArgs = {
    temporaryIdPrefix: 'temporary-',
    dbPath: baseFile,
    dbMigrationsPrefix: migrations,
    authentication
  }

  const file: FileServerArgs = {
    uploadLimits: {
      video: 100,
      audio: 50,
      image: 5,
    },
    uploadsPrefix: upload,
    uploadsRelative,
    extensions: {
      [LoadType.Audio]: [
        'aiff',
        'mp3',
      ],
      [LoadType.Image]: [
        'jpeg',
        'jpg',
        'png',
        'svg',
      ],

      [LoadType.Video]: [
        'mov',
        'mp4',
        'mpeg',
        'mpg',
      ],
    },
    authentication
  }


  const rendering: RenderingServerArgs = {
    temporaryDirectory: temporary,
    cacheDirectory, authentication, commandOutputs, previewSize, outputSize
  }

  const streamingFormatOptions: StreamingFormatOptions = {
    [StreamingFormat.Hls]: {
      commandOutput: outputDefaultHls(commandOutput),
      segmentFile: `000000.${ExtTs}`,
      url: '/hls',
      directory: `${temporary}/streams`,
      file: `index.${ExtHls}`,
    },
    [StreamingFormat.Rtmp]: {
      commandOutput: outputDefaultRtmp(commandOutput),
      segmentFile: '',
      file: `index.${ExtRtmp}`,
      url: '/rtmp',
      directory: `${temporary}/streams/rtmp`,
    },
    [StreamingFormat.Mdash]: {
      commandOutput: outputDefaultDash(commandOutput),
      segmentFile: '',
      file: `index.${ExtDash}`,
      url: '/rtmp',
      directory: `${temporary}/streams/mdash`,
    },
  }
  const streaming: StreamingServerArgs = {
    streamingFormatOptions,
    commandOutput: outputDefaultHls(commandOutput),
    appName: StreamingFormat.Rtmp,
    cacheDirectory: `${temporary}/cache`,
    temporaryDirectory: temporary,
    webrtcStreamingDir: `${temporary}/streams/webrtc`,
    rtmpOptions: {
      port: 1935,
      chunk_size: 60000,
      gop_cache: true,
      ping: 30,
      ping_timeout: 60
    },
    httpOptions: {
      port: basePort + 1,
      mediaroot: `${temporary}/streams`,
      allow_origin: "*"
    },
    authentication
  }

  const web: WebServerArgs = {
    sources: { '/': home },
    authentication
  }

  const options = {
    port: basePort, host: definedHost, version,
    corsOptions: { origin: "*" },
    api, data, file, rendering, streaming, web
  }

  return options
}
