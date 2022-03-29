import fs from 'fs'
import path from "path"
import Express from "express"

const NodeMediaServer = require('node-media-server')
const uuid = require('uuid').v4

import {
  UnknownObject,
  StreamingStartResponse,
  StreamingPreloadResponse, StreamingPreloadRequest,
  StreamingCutRequest, StreamingCutResponse,
  StreamingStatusResponse, StreamingStatusRequest, Endpoints,
  StreamingDeleteRequest, StreamingDeleteResponse,
  StreamingRemoteRequest, StreamingRemoteResponse,
  StreamingLocalRequest, StreamingLocalResponse,
  StreamingWebrtcRequest, StreamingWebrtcResponse, WithError, StreamingStartRequest,
  CommandOutput, StreamingFormat, outputDefaultStreaming, OutputFormat, ExtHls, ExtTs
} from "@moviemasher/moviemasher.js"

import { ServerHandler } from "../../declaration"
import { WebrtcConnection } from './WebrtcConnection'
import { ServerClass } from '../ServerClass'
import { ServerArgs } from '../Server'
import { HostServers } from '../../Host/Host'
import { streamingProcessCreate, streamingProcessGet } from './StreamingProcess/StreamingProcessFactory'
import { StreamingProcessArgs, StreamingProcessCutArgs } from './StreamingProcess/StreamingProcess'
import { FileServer } from '../FileServer/FileServer'
import { directoryLatest } from '../../Utilities/Directory'


export interface FormatOptions {
  commandOutput: CommandOutput
  file: string
  segmentFile: string
  url: string
  directory: string
}
export type StreamingFormatOptions = {
  [index in StreamingFormat]: FormatOptions
}


interface StreamingServerArgs extends ServerArgs {
  streamingFormatOptions: StreamingFormatOptions
  app: string
  httpOptions: UnknownObject
  rtmpOptions: UnknownObject
  commandOutput: CommandOutput
  webrtcStreamingDir: string
  cacheDirectory: string
}


class StreamingServer extends ServerClass {
  declare args: StreamingServerArgs

  cut: ServerHandler<StreamingCutResponse, StreamingCutRequest> = (req, res) => {
    const request = req.body

    const { id, mashObjects, definitionObjects } = request

    const streamingProcess = streamingProcessGet(id)
    if (!streamingProcess) {
      res.send({ error: 'stream not found' })
      return
    }
    try {
      console.log(Endpoints.streaming.cut, 'request', request)
      const cutArgs: StreamingProcessCutArgs = { definitionObjects, mashObjects }
      const updated = streamingProcess.cut(cutArgs)
      const response: StreamingCutResponse = updated
      console.log(Endpoints.streaming.cut, 'response', response)
      res.send(response)
    } catch (error) {
      res.send({ error: String(error) })
      console.error(error)
    }
  }

  delete: ServerHandler<StreamingDeleteResponse, StreamingDeleteRequest> = (req, res) => {
    const { id } = req.body
    const connection = WebrtcConnection.getConnection(id)
    if (!connection) {
      res.send({ error: `no connection ${id}` })
      return
    }

    connection.close()
    const response: StreamingDeleteResponse = {}
    res.send(response)
  }


  fileServer?: FileServer

  remote: ServerHandler<StreamingRemoteResponse | WithError, StreamingRemoteRequest> = async(req, res) => {
    const { id, localDescription } = req.body
    const connection = WebrtcConnection.getConnection(id)
    if (!connection) {
      res.send({ error: `no connection ${id}` })
      return
    }
    try {
      await connection.applyAnswer(localDescription)

      const { remoteDescription } = connection
      if (!remoteDescription) return res.send({ error: `no remoteDescription for connection ${id}`})

      const description = connection.toJSON().remoteDescription
      if (!description) return res.send({ error: `no remote description for connection ${id}`})

      const response: StreamingRemoteResponse = { localDescription: description }

      res.send(response)
    } catch (error) {
      res.send({ error: String(error) })
      console.error(error)
    }
  }

  local: ServerHandler<StreamingLocalResponse | WithError, StreamingLocalRequest> = (req, res) => {
    const { id } = req.body
    const connection = WebrtcConnection.getConnection(id)
    if (!connection) {
      res.send({ error: `no connection ${id}` })
      return
    }

    const { localDescription } = connection
    if (!localDescription) return res.send({ error: `no localDescription for connection ${id}`})

    const description = connection.toJSON().localDescription
    if (!description) return res.send({ error: `no local description for connection ${id}`})

    const response: StreamingLocalResponse = { localDescription: description }
    res.send(response)
  }

  id = 'streaming'

  preload: ServerHandler<StreamingPreloadResponse, StreamingPreloadRequest> = (req, res) => {
    const { id, files } = req.body
    const response: StreamingPreloadResponse = {}
    res.send(response)
  }

  // TODO: support other output besides HLS file
  start: ServerHandler<StreamingStartResponse, StreamingStartRequest> = (req, res) => {
    const request = req.body
    const { width, height, videoRate, format } = request
    const streamingFormat = format || StreamingFormat.Hls
    const id = uuid()
    const formatOptions = this.args.streamingFormatOptions[streamingFormat]

    const { commandOutput, directory, file } = formatOptions
    const overrides = { ...commandOutput }
    if (width) overrides.width = width
    if (height) overrides.height = height
    if (videoRate) overrides.videoRate = videoRate

    const streamingCommandOutput = outputDefaultStreaming(overrides)

    const {
      width: outputWidth,
      height: outputHeight,
      videoRate: outputVideoRate,
      options,
    } = streamingCommandOutput

    const response: StreamingStartResponse = {
      width: outputWidth,
      height: outputHeight,
      videoRate: outputVideoRate,
      format: streamingFormat,
      id, readySeconds: 10
    }
    switch (streamingFormat) {
      case StreamingFormat.Hls: {
        const { hls_time } = options
        if (typeof hls_time !== 'undefined') response.readySeconds = Number(hls_time)
      }
    }
    try {
      const user = this.userFromRequest(req)
      const { cacheDirectory } = this.args
      const filePrefix = this.fileServer!.args.uploadsPrefix
      const streamingDirectory = directory
      const streamingProcessArgs: StreamingProcessArgs = {
        filePrefix, defaultDirectory: user, validDirectories: ['shared'],
        cacheDirectory, id, directory: streamingDirectory,
        file, commandOutput: streamingCommandOutput
      }
      const connection = streamingProcessCreate(streamingProcessArgs)
      connection.cut(connection.defaultContent())
    } catch (error) { response.error = String(error) }
    res.send(response)
  }

  startMediaServer(): void {
    const task: UnknownObject = { app: this.args.app }

    const {
      videoCodec, width, height, audioCodec, audioBitrate, audioChannels,
      audioRate, format
    } = this.args.streamingFormatOptions[StreamingFormat.Hls].commandOutput
    // const flags = options && `[${Object.entries(options).map(([k, v]) => `${k}=${v}`).join(':')}]`

    switch (format) {
      case OutputFormat.Hls: {
        task.hls = true
        // if (flags) task.hlsFlags = flags
        break
      }
      // case StreamingFormat.Rtmp: {
      //   task.rtmp = true
      //   task.rtmpApp = 'stream'
      //   break
      // }
      // case 'mp4': {
      //   task.dash = true
      //   if (flags) task.dashFlags = flags
      //   break // [f=dash:window_size=3:extra_window_size=5]
      // }
    }

    if (audioCodec) task.ac = audioCodec
    const acParam:string[] = []
    if (audioBitrate) acParam.push('-ab', String(audioBitrate))
    if (audioChannels) acParam.push('-ac', String(audioChannels))
    if (audioRate) acParam.push('-ar', String(audioRate))
    task.acParam = acParam

    if (videoCodec) task.vc = videoCodec
    const vcParam:string[] = []
    if (width && height) vcParam.push('-s', `${width}x${height}`)
    // TODO: not sure why FPS fails?
    // if (fps) vcParam.push('-fps', String(fps))

    task.vcParam = vcParam

    const config = {
      // rtmp: this.args.rtmpOptions,
      http: this.args.httpOptions,
      // trans: {
      //   ffmpeg: '/usr/local/bin/ffmpeg',
      //   tasks: [task]
      // }
    }
    const nms = new NodeMediaServer(config)
    nms.run()
  }

  startServer(app: Express.Application, activeServers: HostServers): void {
    super.startServer(app, activeServers)
    this.fileServer = activeServers.file

    app.post(Endpoints.streaming.start, this.start)
    app.post(Endpoints.streaming.preload, this.preload)
    app.post(Endpoints.streaming.status, this.status)
    app.post(Endpoints.streaming.cut, this.cut)

    app.post(Endpoints.streaming.local, this.local)
    app.post(Endpoints.streaming.remote, this.remote)
    app.post(Endpoints.streaming.webrtc, this.webrtc)
    app.post(Endpoints.streaming.delete, this.delete)

    app.get('/webrtc/:id', (req, res) => {
      console.log('GET webrtc/:id')
      const { id } = req.params
      const connection = WebrtcConnection.getConnection(id)
      if (!connection) {
        res.send({ error: `no connection ${id}` })
        return
      }

      res.send(connection)
    })

    app.get(`/hls/:id/*.${ExtTs}`, async (req, res) => {
      const hlsFormatOptions = this.args.streamingFormatOptions.hls
      const { params, path: requestPath } = req
      const fileName = path.basename(requestPath)
      const { id } = params
      const file = `${hlsFormatOptions.directory}/${id}/${fileName}`

      // console.log("file", file)
      try { res.send(fs.readFileSync(file)) }
      catch (error) {
        console.error(error);
        res.sendStatus(500);
      }
    })

    app.get(`/hls/:id/*.${ExtHls}`, async (req, res) => {
      const { id } = req.params
      const hlsFormatOptions = this.args.streamingFormatOptions.hls
      try {

        const filePath = directoryLatest(path.join(hlsFormatOptions.directory, id), ExtHls)
        if (!filePath) {
          console.error(`404 /hls/:id/*.${ExtHls}`, id)
          res.sendStatus(404)
          return
        }
        res.send(fs.readFileSync(filePath))
      } catch (error) {
        console.error(error)
        res.sendStatus(500)
      }
    })

    this.startMediaServer()
  }

  status: ServerHandler<StreamingStatusResponse, StreamingStatusRequest> = (req, res) => {
    const { body } = req
    const { id } = body
    const response: StreamingStatusResponse = {}
    const streamingProcess = streamingProcessGet(id)
    if (streamingProcess) {
      const { format } = streamingProcess.args.commandOutput
      const streamingFormat = format as string as StreamingFormat

      if (this.streamReady(id, streamingFormat)) {
        response.streamUrl = this.streamUrl(id, streamingFormat)
      }
    } else {
      response.error = 'stream not found'
    }
    res.send(response)
  }

  stopServer(): void { WebrtcConnection.close() }

  streamReady(id: string, streamingFormat: StreamingFormat): boolean {
    const formatOptions: FormatOptions = this.args.streamingFormatOptions[streamingFormat]
    const paths: string[] = []
    switch (streamingFormat) {
      case StreamingFormat.Hls: {
        paths.push(path.resolve(formatOptions.directory, id, formatOptions.segmentFile))
        paths.push(path.resolve(formatOptions.directory, id, formatOptions.file))
        break
      }
      case StreamingFormat.Rtmp:
      default: {
        paths.push(path.resolve(formatOptions.directory, id, formatOptions.file))
        break
      }
    }
    if (!paths.length) return false

    return paths.every(file => fs.existsSync(file))
  }

  streamUrl(id: string, streamingFormat: StreamingFormat): string | undefined {
    const formatOptions: FormatOptions = this.args.streamingFormatOptions[streamingFormat]
    const { url, file } = formatOptions
    return `${url}/${id}/${file}`
  }

  webrtc: ServerHandler<WebrtcConnection | WithError, StreamingWebrtcRequest> = async (_, res) => {
    try {
      // const { localDescription } = req.body
      const hlsFormatOptions = this.args.streamingFormatOptions[StreamingFormat.Hls]
      const connection = WebrtcConnection.create(uuid(), this.args.webrtcStreamingDir, hlsFormatOptions.commandOutput)

      await connection.doOffer()

      const { localDescription, id } = connection
      if (!localDescription) {
        res.send({ error: 'could not create connection' })
        return
      }
      const response: StreamingWebrtcResponse = { localDescription, id }

      res.send(response)

    } catch (error) {
      res.send({ error: String(error) })
      console.error(error)
    }
  }
}

export { StreamingServer, StreamingServerArgs }
