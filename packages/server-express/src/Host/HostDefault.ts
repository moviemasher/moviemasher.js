import {
  ExtDash, ExtRtmp, ExtHls, ExtTs, StreamingFormat,
  outputDefaultDash, outputDefaultRtmp, outputDefaultHls, CommandOutput
} from "@moviemasher/moviemasher.js"

import { ApiServerArgs } from "../Server/ApiServer/ApiServer"
import { DataServerArgs } from "../Server/DataServer/DataServer"
import { FileServerArgs } from "../Server/FileServer/FileServer"
import { RenderingServerArgs } from "../Server/RenderingServer/RenderingServer"
import { ServerAuthentication } from "../Server/Server"
import { StreamingServerArgs } from "../Server/StreamingServer/StreamingServer"
import { WebServerArgs } from "../Server/WebServer/WebServer"
import { HostOptions } from "./Host"

const OpenAuthentication: ServerAuthentication = { type: "http" }

interface HostDefaultOptions {
  port?: number
  outputWidth?: number
  outputHeight?: number
  outputRate?: number
  auth?: ServerAuthentication
  temporaryDirectory?: string
  home?: string
}

const HostDefaultPort = 8570
const HostDefault = (args: HostDefaultOptions): HostOptions => {
  const {
    outputHeight, outputWidth, outputRate,
    port, auth, home, temporaryDirectory
  } = args
  const commandOutput: CommandOutput = {}
  const basePort = port || HostDefaultPort
  if (outputWidth) commandOutput.width = outputWidth
  if (outputHeight) commandOutput.height = outputHeight
  if (outputRate) commandOutput.videoRate = outputRate


  const temporary = temporaryDirectory || '../../../temporary'
  const authentication = auth || OpenAuthentication
  const source = home || "../example-client-react/dist/masher.html"

  const api: ApiServerArgs = {}
  const data: DataServerArgs = {
    prefix: "/data",
    dbPath: `${temporary}/data.db`,
    dbMigrationsPrefix: "./dev/data/migrations",
    authentication
  }

  const file: FileServerArgs = {
    uploadLimits: {
      video: 100,
      audio: 50,
      image: 5,
    },
    uploadsPrefix: `${temporary}/uploads`,
    extensions: [
      'aiff',
      'jpeg',
      'jpg',
      'mov',
      'mp3',
      'mp4',
      'mpeg',
      'mpg',
      'png',
      'svg',
    ],
    authentication
  }

  const rendering: RenderingServerArgs = {
    cacheDirectory: `${temporary}/cache`,
    renderingDirectory: `${temporary}/rendering`,
    authentication
  }

  const streaming: StreamingServerArgs = {
    streamingOptions: {
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
    },
    commandOutput: outputDefaultHls(commandOutput),

    app: StreamingFormat.Rtmp,
    cacheDirectory: `${temporary}/cache`,
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
    sources: { '/': source },
    authentication
  }

  const options = {
    port: basePort,
    corsOptions: { origin: "*" },
    api,data, file, rendering, streaming, web,
  }

  return options
}

export { HostDefault, HostDefaultOptions, HostDefaultPort }
