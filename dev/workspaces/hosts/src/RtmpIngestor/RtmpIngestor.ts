import NodeMediaServer from 'node-media-server'
import { UnknownObject } from '@moviemasher/moviemasher.js'

import { Command } from "../Command/Command"
import { RtmpIngestorArgs, Server } from "../declaration"

class RtmpIngestor implements Server {
  constructor(args?: RtmpIngestorArgs) {
    if (args) {
      if (args.app) this.app = args.app
      if (args.httpOptions) this.httpOptions = args.httpOptions
      if (args.inputOptions) this.inputOptions = args.inputOptions
      if (args.outputOptions) this.outputOptions = args.outputOptions
      if (args.outputPrefix) this.outputPrefix = args.outputPrefix
      if (args.prefix) this.prefix = args.prefix
    }
  }

  app = 'rtmp'

  // HTTP internal proxy uses unpublished port - use HlsServer to publish
  httpOptions: UnknownObject = {
    port: 8579,
    mediaroot: './temporary/streams/rtmp',
    allow_origin: '*'
  }

  index(): UnknownObject { return {} }

  // RTMP stream
  inputOptions: UnknownObject = {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60,
  }


  outputOptions = Command.outputHls()

  outputPrefix = './temporary/streams'

  prefix = '/rtmp'

  start(app: Express.Application): void {
    const task: UnknownObject = { app: this.app }
    const { outputOptions } = this
    const { options } = outputOptions
    const flags = options ? Command.optionsFlags(options) : ''

    switch (outputOptions.format) {
      case 'hls': {
        task.hls = true
        if (flags) task.hlsFlags = flags
        break
      }
      case 'rtmp': {
        task.rtmp = true
        task.rtmpApp = 'stream'
        break
      }
      case 'mp4': {
        task.dash = true
        if (flags) task.dashFlags = flags
        break // [f=dash:window_size=3:extra_window_size=5]
      }
    }

    const { audioCodec, audioBitrate, audioChannels, audioFrequency, } = outputOptions
    if (audioCodec) task.ac = audioCodec
    const acParam:string[] = []
    if (audioBitrate) acParam.push('-ab', String(audioBitrate))
    if (audioChannels) acParam.push('-ac', String(audioChannels))
    if (audioFrequency) acParam.push('-ar', String(audioFrequency))
    task.acParam = acParam

    const { videoCodec, width, height, fps } = outputOptions
    if (videoCodec) task.vc = videoCodec
    const vcParam:string[] = []
    if (width && height) vcParam.push('-s', `${width}x${height}`)
    // TODO: not sure why FPS fails?
    // if (fps) vcParam.push('-fps', String(fps))

    task.vcParam = vcParam

    const config = {
      rtmp: this.inputOptions,
      http: this.httpOptions,
      trans: {
        ffmpeg: '/usr/local/bin/ffmpeg',
        tasks: [task]
      }
    }

    const nms = new NodeMediaServer(config)
    nms.run()
  }
  stop():void {}
}


export { RtmpIngestor, RtmpIngestorArgs }
