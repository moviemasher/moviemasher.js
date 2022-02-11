import { Default } from "@moviemasher/moviemasher.js"
import { outputDefaultDash, outputDefaultFlv, OutputFormat, outputDefaultHls, outputDefaultMp4 } from "@moviemasher/moviemasher.js"
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
  const { port, outputHeight, outputWidth, outputRate, temporaryDirectory, auth, home } = args
  const width = outputWidth || Default.mash.output.width
  const height = outputHeight || Default.mash.output.height
  const videoRate = outputRate || Default.mash.output.videoRate
  const outputOptions = { width, height, videoRate }
  const temporary = temporaryDirectory || '/temp'
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
    outputDefault: outputDefaultMp4(outputOptions),
    cacheDirectory: `${temporary}/cache`,
    renderingDirectory: `${temporary}/rendering`,
    authentication
  }

  const streaming: StreamingServerArgs = {
    output: {
      [OutputFormat.Hls]: outputDefaultHls(outputOptions),
      [OutputFormat.Rtmp]: outputDefaultFlv(outputOptions),
      [OutputFormat.Dash]: outputDefaultDash(outputOptions),
    },

    outputOptions: outputDefaultHls(outputOptions),
    app: "rtmp",
    rtmpStreamingDir: `${temporary}/streams/rtmp`,
    webrtcStreamingDir: `${temporary}/streams/webrtc`,
    rtmpStreamingUrl: "/rtmp",
    rtmpStreamingFile: "index.flv",
    hlsStreamingDir: `${temporary}/streams`,
    hlsStreamingUrl: "/hls",
    hlsStreamingFile: "000000.ts",
    hlsFile: "index.m3u8",
    rtmpOptions: {
      port: 1935,
      chunk_size: 60000,
      gop_cache: true,
      ping: 30,
      ping_timeout: 60
    },
    httpOptions: {
      port: 8578,
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
    port: port || HostDefaultPort,
    corsOptions: { origin: "*" },
    api,data, file, rendering, streaming, web,
  }

  return options
}

export { HostDefault, HostDefaultOptions, HostDefaultPort }
