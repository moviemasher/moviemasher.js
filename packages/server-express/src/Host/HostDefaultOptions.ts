import path from 'path'
import {
  ExtDash, ExtRtmp, ExtHls, ExtTs, StreamingFormat,
  LoadType, Size, CommandOutput 
} from "@moviemasher/moviemasher.js"
import { 
  outputDefaultDash, outputDefaultRtmp, outputDefaultHls, expandFileOrScript
} from '@moviemasher/server-core'

import { ApiServerArgs } from "../Server/ApiServer/ApiServer"
import { DataServerArgs } from "../Server/DataServer/DataServer"
import { FileServerArgs } from "../Server/FileServer/FileServer"
import { RenderingServerArgs } from "../Server/RenderingServer/RenderingServer"
import { ServerAuthentication } from "../Server/Server"
import { StreamingFormatOptions, StreamingServerArgs } from "../Server/StreamingServer/StreamingServer"
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
    publicDirectory = "./images/standalone/public",
    privateDirectory = "./images/standalone/private",
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
  const api: ApiServerArgs = {
    authentication
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
    temporaryDirectory,
    cacheDirectory, authentication, commandOutputs, previewSize, outputSize
  }

  const streamingFormatOptions: StreamingFormatOptions = {
    [StreamingFormat.Hls]: {
      commandOutput: outputDefaultHls(commandOutput),
      segmentFile: `000000.${ExtTs}`,
      url: '/hls',
      directory: `${temporaryDirectory}/streams`,
      file: `index.${ExtHls}`,
    },
    [StreamingFormat.Rtmp]: {
      commandOutput: outputDefaultRtmp(commandOutput),
      segmentFile: '',
      file: `index.${ExtRtmp}`,
      url: '/rtmp',
      directory: `${temporaryDirectory}/streams/rtmp`,
    },
    [StreamingFormat.Mdash]: {
      commandOutput: outputDefaultDash(commandOutput),
      segmentFile: '',
      file: `index.${ExtDash}`,
      url: '/rtmp',
      directory: `${temporaryDirectory}/streams/mdash`,
    },
  }
  const streaming: StreamingServerArgs = {
    streamingFormatOptions,
    commandOutput: outputDefaultHls(commandOutput),
    appName: StreamingFormat.Rtmp,
    cacheDirectory: `${temporaryDirectory}/cache`,
    temporaryDirectory,
    webrtcStreamingDir: `${temporaryDirectory}/streams/webrtc`,
    rtmpOptions: {
      port: 1935,
      chunk_size: 60000,
      gop_cache: true,
      ping: 30,
      ping_timeout: 60
    },
    httpOptions: {
      port: basePort + 1,
      mediaroot: `${temporaryDirectory}/streams`,
      allow_origin: "*"
    },
    authentication
  }

  const web: WebServerArgs = {
    sources: { '/': `${publicDirectory}/index.html` }, authentication
  }

  const options = {
    port: basePort, host: definedHost, version,
    corsOptions: { origin: "*" },
    api, data, file, rendering, streaming, web
  }

  return options
}
