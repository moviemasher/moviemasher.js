import fs from 'fs'
import path from "path"
import Express from "express"

const NodeMediaServer = require('node-media-server')
const uuid = require('uuid').v4

import {
  outputDefaultHls, UnknownObject, OutputFormat,
  StreamingStartResponse,
  StreamingPreloadResponse, StreamingPreloadRequest,
  StreamingCutRequest, StreamingCutResponse,
  StreamingStatusResponse, StreamingStatusRequest, Endpoints,
  StreamingDeleteRequest, StreamingDeleteResponse,
  StreamingRemoteRequest, StreamingRemoteResponse,
  StreamingLocalRequest, StreamingLocalResponse,
  StreamingWebrtcRequest, StreamingWebrtcResponse, WithError, StreamingStartRequest,
  OutputOptions, VideoOutputArgs

} from "@moviemasher/moviemasher.js"

import { EditOutputOptions, ServerHandler } from "../../declaration"
import { EncodeConnection } from "./EncodeConnection"
import { WebrtcConnection } from './WebrtcConnection'
import { ServerClass } from '../ServerClass'
import { ServerArgs } from '../Server'
import { HostServers } from '../../Host/Host'

const ExtHls = 'm3u8'
const ExtTs = 'ts'

interface StreamingServerArgs extends ServerArgs {
  output: EditOutputOptions
  app: string
  httpOptions: UnknownObject
  rtmpOptions: UnknownObject
  outputOptions: OutputOptions
  rtmpStreamingDir: string
  rtmpStreamingUrl: string
  rtmpStreamingFile: string
  hlsStreamingDir: string
  hlsStreamingUrl: string
  hlsStreamingFile: string
  webrtcStreamingDir: string
  hlsFile: string
}


class StreamingServer extends ServerClass {
  declare args: StreamingServerArgs

  cut: ServerHandler<StreamingCutResponse, StreamingCutRequest> = (req, res) => {
    const { body } = req
    const { id, filterGraph } = body
    const connection = EncodeConnection.get(id)
    if (!connection) {
      res.send({ error: 'stream not found' })
      return
    }
    try {
      console.log(Endpoints.streaming.cut, 'request', body)
      const updated = connection.update(filterGraph, this.hlsOutput(id))
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

  hlsOutput(id: string): VideoOutputArgs {
    const output = outputDefaultHls() as VideoOutputArgs
    const { options } = output
    const destination = this.args.hlsStreamingDir

    if (options) {
      const hlsFile = this.latestHlsFile(id)
      if (hlsFile) {
        options.hls_flags ||= ''
        options.hls_flags += `${options.hls_flags ? '+' : ''}append_list`

        const number = this.latestTsNumber(id)
        if (typeof number !== 'undefined') options.start_number = number + 1
      }
      const { hls_segment_filename } = options
      if (typeof hls_segment_filename === 'string') {
        if (!hls_segment_filename.includes('/')) {
          options.hls_segment_filename = `${destination}/${id}/${hls_segment_filename}`
        }
      }
    }
    return output
  }

  id = 'streaming'

  private latestHlsFile(id: string, ext = ExtHls): string | undefined {
    const streamDir = `${this.args.hlsStreamingDir}/${id}`
    if (!fs.existsSync(streamDir)) return

    const files = fs.readdirSync(streamDir)
    const filesWithExt = files.filter(file => file.endsWith(ext)).sort()
    const count = filesWithExt.length
    const file = count && filesWithExt[count - 1]
    if (!file) return

    return `${streamDir}/${file}`
  }

  latestTsNumber(id: string): number | undefined {
    const file = this.latestHlsFile(id, ExtTs)
    if (!file) return

    return Number(path.basename(file, `.${ExtTs}`))
  }

  preload: ServerHandler<StreamingPreloadResponse, StreamingPreloadRequest> = (req, res) => {
    const { id, files } = req.body


    const response: StreamingPreloadResponse = {}
    res.send(response)
  }

  // TODO: support other output besides HLS file
  start: ServerHandler<StreamingStartResponse, StreamingStartRequest> = (req, res) => {
    const { version } = req.body

    console.log(Endpoints.streaming.start)
    const id = uuid()
    const output = this.hlsOutput(id)
    const connection = EncodeConnection.create(id, this.args.hlsStreamingDir, output)
    const segment = connection.defaultFilterGraph(output)
    connection.update(segment)

    const { height, width, options, format, videoRate } = output

    const response: StreamingStartResponse = {
      height, width, videoRate,
      id, readySeconds: 10
    }
    switch (format) {
      case 'hls': {
        const { hls_time } = options
        if (typeof hls_time !== 'undefined') response.readySeconds = Number(hls_time)
      }
    }
    console.log(Endpoints.streaming.start, 'response', response)
    res.send(response)
  }

  startMediaServer(): void {
    const task: UnknownObject = { app: this.args.app }

    const {
      videoCodec, width, height, audioCodec, audioBitrate, audioChannels,
      audioRate, options, format
    } = this.args.output[OutputFormat.Hls]!
    // const flags = options && `[${Object.entries(options).map(([k, v]) => `${k}=${v}`).join(':')}]`

    switch (format) {
      case OutputFormat.Hls: {
        task.hls = true
        // if (flags) task.hlsFlags = flags
        break
      }
      // case OutputFormat.Rtmp: {
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

    // app.get('/webrtc/:id/remote-description', (req, res) => {
    //   console.log('GET webrtc/:id/remote-description')
    //   const { id } = req.params
    //   const connection = WebrtcConnection.getConnection(id)
    //   if (!connection) {
    //     res.send({ error: `no connection ${id}` })
    //     return
    //   }
    //   res.send(connection.toJSON().remoteDescription)
    // })

    // app.post('/webrtc/:id/remote-description', )

    app.get(`/hls/:id/*.${ExtTs}`, async (req, res) => {
      const { params, path: requestPath } = req
      const fileName = path.basename(requestPath)
      const { id } = params
      const file = `${this.args.hlsStreamingDir}/${id}/${fileName}`

      // console.log("file", file)
      try { res.send(fs.readFileSync(file)) }
      catch (error) {
        console.error(error);
        res.sendStatus(500);
      }
    })

    app.get(`/hls/:id/*.${ExtHls}`, async (req, res) => {
      const { id } = req.params
      try {
        const filePath = this.latestHlsFile(id)
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
    const connection = EncodeConnection.get(id)
    if (connection) {

      const { format } = connection.outputObject
      const serverType = format === 'hls' ? OutputFormat.Hls : OutputFormat.Rtmp

      if (this.streamReady(id, serverType)) {
        response.streamUrl = this.streamUrl(id, serverType)
      }
    } else {
      response.error = 'stream not found'
    }
    res.send(response)
  }

  stopServer(): void { WebrtcConnection.close() }

  streamReady(id: string, outputFormat: OutputFormat): boolean {
    if (!(outputFormat === OutputFormat.Hls || outputFormat === OutputFormat.Rtmp)) return false

    const paths: string[] = []

    switch (outputFormat) {
      case OutputFormat.Hls: {
        paths.push(path.resolve(this.args.hlsStreamingDir, id, this.args.hlsStreamingFile))
        paths.push(path.resolve(this.args.hlsStreamingDir, id, this.args.hlsFile))

        break
      }
      case OutputFormat.Rtmp: {
        paths.push(path.resolve(this.args.rtmpStreamingDir, id, this.args.rtmpStreamingFile))

        break
      }
    }
    if (!paths.length) return false

    return paths.every(file => fs.existsSync(file))
  }

  streamUrl(id: string, outputFormat: OutputFormat): string | undefined {
    if (!(outputFormat === OutputFormat.Hls || outputFormat === OutputFormat.Rtmp)) return

    let url = ''
    let file = ''
    switch (outputFormat) {
      case OutputFormat.Hls: {
        url = this.args.hlsStreamingUrl
        file = this.args.hlsFile
        break
      }
      case OutputFormat.Rtmp: {
        url = this.args.rtmpStreamingUrl
        file = this.args.rtmpStreamingFile
        break
      }
    }
    if (!(url && file)) return

    return `${url}/${id}/${file}`
  }

  webrtc: ServerHandler<WebrtcConnection | WithError, StreamingWebrtcRequest> = async (_, res) => {
    try {
      // const { localDescription } = req.body
      const connection = WebrtcConnection.create(uuid(), this.args.webrtcStreamingDir, this.args.output[OutputFormat.Hls])

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
