import NodeMediaServer from 'node-media-server'
import { UnknownObject } from '@moviemasher/moviemasher.js'

import { Command, CommandOutputOptions } from "../Command/Command"
import { Server } from "../declaration"

interface RtmpIngestorArgs {
  outputOptions?: CommandOutputOptions
  endpointPrefix: string
  outputPrefix: string
}


class RtmpIngestor implements Server {
  constructor(args?: RtmpIngestorArgs) {
    if (args) {
      if (args.endpointPrefix) this.endpointPrefix = args.endpointPrefix
      if (args.outputPrefix) this.outputPrefix = args.outputPrefix
      if (args.outputOptions) this.outputOptions = args.outputOptions
    }
  }
  endpointPrefix = 'rtmp'

  outputOptions = Command.outputHls()

  outputPrefix = './temp'

  start(app: Express.Application): void {
    const task: UnknownObject = { app: this.endpointPrefix }
    const { outputOptions } = this
    const { options } = outputOptions
    const flags = options ? Command.optionsFlags(options) : ''

    switch (outputOptions.format) {
      case 'hls': {
        task.hls = true
        if (flags) task.hlsFlags = flags
        task.hlsFlags = '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]'
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

    const { videoCodec, size, fps } = outputOptions
    if (videoCodec) task.vc = videoCodec
    const vcParam:string[] = []
    if (size) vcParam.push('-s', size)
    // TODO: not sure why FPS fails?
    // if (fps) vcParam.push('-fps', String(fps))

    task.vcParam = vcParam

    const config = {
      rtmp: {
        port: 1935,
        chunk_size: 60000,
        gop_cache: true,
        ping: 30,
        ping_timeout: 60,
      },
      http: {
        port: 8579,
        mediaroot: this.outputPrefix,
        allow_origin: '*'
      },
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


export { RtmpIngestor }
