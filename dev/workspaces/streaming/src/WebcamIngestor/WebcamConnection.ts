import wrtc from 'wrtc'
import fs from 'fs'
import { v4 as uuid } from 'uuid'
import EventEmitter from 'events'
import path from 'path'
import internal, { PassThrough } from 'stream'
import { Any } from '@moviemasher/moviemasher.js'

import { ConnectionJson } from '../declaration'
import { StreamInput, StreamOutput } from '../SocketStreams'
import { Command, CommandInputOptions, CommandOutputOptions } from '../Command/Command'

const { RTCPeerConnection } = wrtc
const { RTCAudioSink, RTCVideoSink } = wrtc.nonstandard
const SegmentPadding = 6
const StreamPadding = 4

interface WebcamStream {
  command: Command
  destination: string
  size: string
  video: PassThrough
  audio: PassThrough
  end?: boolean
}

interface AudioData {
  samples: {
    buffer: ArrayBuffer
  }
}

interface FrameData extends EventListenerObject {
  frame: {
    width: number
    height: number
    data: ArrayBuffer
  }
}

const TIME_TO_CONNECTED = 10000
const TIME_TO_HOST_CANDIDATES = 2000
const TIME_TO_RECONNECTED = 10000

class WebcamConnection extends EventEmitter {
  constructor(id: string, outputPrefix?: string, outputOptions?: CommandOutputOptions) {
    super()
    this.id = id
    this.state = 'open'
    if (outputOptions) this.outputOptions = outputOptions
    if (outputPrefix) this.outputPrefix = outputPrefix
    this.onIceConnectionStateChange = this.onIceConnectionStateChange.bind(this)
    this.onAudioData = this.onAudioData.bind(this)
    this.onFrameData = this.onFrameData.bind(this)
    this.beforeOffer()
  }

  async applyAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
    await this.peerConnection.setRemoteDescription(answer)
  }

  beforeOffer():void {
    const audioSink = this.createAudioSink()
    const videoSink = this.createVideoSink()

    videoSink.addEventListener('frame', this.onFrameData)
    audioSink.addEventListener('data', this.onAudioData)

    const { close } = this.peerConnection

    const { stream } = this

    stream?.audio.on('end', () => {
      audioSink.removeEventListener('data', this.onAudioData)
    })

    this.peerConnection.close = function() {
      audioSink.stop()
      videoSink.stop()
      if (!stream) return

      const { audio, video, end } = stream
      if (end) return

      if (audio) audio.end()
      video.end()
      return close.apply(this)
    }
  }

  createAudioSink(): Any {
    const audioTransceiver = this.peerConnection.addTransceiver('audio')
    return new RTCAudioSink(audioTransceiver.receiver.track)

  }

  createVideoSink(): Any {
    const videoTransceiver = this.peerConnection.addTransceiver('video')
    return new RTCVideoSink(videoTransceiver.receiver.track)
  }

  close(): void {
    this.peerConnection.removeEventListener('iceconnectionstatechange', this.onIceConnectionStateChange)
    if (this.connectionTimer) {
      clearTimeout(this.connectionTimer)
      this.connectionTimer = undefined
    }
    if (this.reconnectionTimer) {
      clearTimeout(this.reconnectionTimer)
      this.reconnectionTimer = undefined
    }
    this.peerConnection.close()

    this.state = 'closed'
    this.emit('closed')
  }

  connectionTimer?: NodeJS.Timeout = setTimeout(() => {
    if (this.peerConnection.iceConnectionState !== 'connected'
      && this.peerConnection.iceConnectionState !== 'completed') {
      this.close()
    }
  }, TIME_TO_CONNECTED)

  async doOffer(): Promise<void> {
    // console.log("doOffer")
    const offer = await this.peerConnection.createOffer()
    await this.peerConnection.setLocalDescription(offer)
    try {
      await this.waitUntilIceGatheringStateComplete()
    } catch (error) {
      this.close()
      throw error
    }
  }

  get iceConnectionState():RTCIceConnectionState {
    return this.peerConnection.iceConnectionState
  }

  id: string

  inputAudio(audio: internal.Stream): CommandInputOptions {
    return {
      source: StreamInput(audio, this.id, 'audio').url,
      options: ['-f s16le', '-ar 48k', '-ac 1']
    }
  }

  inputVideo(video: internal.Stream, size: string): CommandInputOptions {
    return {
      source: StreamInput(video, this.id, 'video').url,
      options: [
        '-f', 'rawvideo',
        '-pix_fmt', 'yuv420p',
        '-s', size,
        '-r', '30',
      ]
    }
  }

  get localDescription(): RTCSessionDescription | null {
    const description = this.peerConnection.localDescription
    if (!description) return description

    const { sdp, ...rest } = description
    return { ...rest, sdp: sdp.replace(/\r\na=ice-options:trickle/g, '') }
  }

  onAudioData({ samples: { buffer } }: AudioData): void {
    // console.log("onAudioData...")
    if (!this.stream || this.stream.end) return

    this.stream.audio.push(Buffer.from(buffer))
    // console.log("onAudioData!")
  }

  onFrameData(frameData: FrameData): void {
    // console.log("onFrameData...")
    const { frame: { width, height, data } } = frameData
    const stream = this.streamForDimensions(width, height)

    this.streams.forEach(item=>{
      if (item !== stream && !item.end) {
        item.end = true
        if (item.audio) item.audio.end()
        item.video.end()
      }
    })

    stream.video.push(Buffer.from(data))
    // console.log("onFrameData!")
  }

  onIceConnectionStateChange(): void {
    // console.log(this.constructor.name, "onIceConnectionStateChange...")
    if (['connected', 'completed'].includes(this.peerConnection.iceConnectionState)) {
      if (this.connectionTimer) {
        clearTimeout(this.connectionTimer)
        this.connectionTimer = undefined
      }
      if (this.reconnectionTimer) {
        clearTimeout(this.reconnectionTimer)
        this.reconnectionTimer = undefined
      }
    } else if (this.peerConnection.iceConnectionState === 'disconnected'
      || this.peerConnection.iceConnectionState === 'failed') {
      if (!this.connectionTimer && !this.reconnectionTimer) {
        this.reconnectionTimer = setTimeout(() => { this.close() }, TIME_TO_RECONNECTED)
      }
    }
    // console.log(this.constructor.name, "onIceConnectionStateChange!")
  }

  outputOptions: CommandOutputOptions = Command.outputHls()

  outputPrefix = './temp/webrtc'

  _peerConnection: RTCPeerConnection | undefined

  get peerConnection(): RTCPeerConnection {
    if (this._peerConnection) return this._peerConnection

    const connection = <RTCPeerConnection> new RTCPeerConnection({ sdpSemantics: 'unified-plan' })
    connection.addEventListener('iceconnectionstatechange', this.onIceConnectionStateChange)
    this._peerConnection = connection
    return connection
  }

  reconnectionTimer?:NodeJS.Timeout

  get remoteDescription(): RTCSessionDescription | null {
    return this.peerConnection.remoteDescription
  }

  get signalingState():RTCSignalingState {
    return this.peerConnection.signalingState
  }

  state: string

  get stream(): WebcamStream | undefined { return this.streams[0] }

  streamForDimensions(width: number, height: number): WebcamStream {
    const size = width + 'x' + height
    const currentStream = this.stream
    if (currentStream && currentStream.size === size) return currentStream

    //console.log("streamForDimensions!!", width, height)

    const prefix = path.resolve(this.outputPrefix, this.id)
    fs.mkdirSync(prefix, { recursive: true })

    const video = new PassThrough()
    const audio = new PassThrough()

    let destination = ''

    const { outputOptions } = this

    const streamsPrefix = String(this.streams.length).padStart(StreamPadding, '0')

    switch (outputOptions.format) {
      case 'hls': {
        destination = `${prefix}/${streamsPrefix}-${size}.m3u8`
        const { options } = outputOptions
        if (options && !Array.isArray(options)) {
          options.hls_segment_filename = `${prefix}/${size}-%0${SegmentPadding}d.ts`
        }
        break
      }
      case 'flv': {
        destination = `${prefix}/${streamsPrefix}-${size}.flv`
        break
      }
      case 'rtmp': {
        destination = 'rtmps://...'
        break
      }
      case 'pipe': {
        const combined = new PassThrough()
        destination = StreamOutput(combined, this.id).url
      }
    }

    const command = Command.create({
      inputs: [this.inputVideo(video, size), this.inputAudio(audio) ],
      output: outputOptions,
      destination
    })

    const webrtcStream = {
      destination,
      size,
      video,
      audio,
      command,
    }

    this.streams.unshift(webrtcStream)

    webrtcStream.command.run()

    return webrtcStream
  }

  streams: WebcamStream[] = []

  toJSON():ConnectionJson {
    return {
      id: this.id, state: this.state,
      iceConnectionState: this.iceConnectionState,
      localDescription: this.localDescription,
      remoteDescription: this.remoteDescription,
      signalingState: this.signalingState
    }
  }

  async waitUntilIceGatheringStateComplete():Promise<void> {
    if (this.peerConnection.iceGatheringState === 'complete') return

    const promise = new Promise<void>((resolve, reject) => {
      const onIceCandidate = (object: RTCPeerConnectionIceEvent) => {
        // console.log("onIceCandidate", object)
        if (!object.candidate) {
          clearTimeout(timeout)
          this.peerConnection.removeEventListener('icecandidate', onIceCandidate)
          resolve()
        }
      }
      const timeout = setTimeout(() => {
        this.peerConnection.removeEventListener('icecandidate', onIceCandidate)
        reject(new Error(`Timed out waiting for host candidates ${this.peerConnection}`))
      }, TIME_TO_HOST_CANDIDATES)

      this.peerConnection.addEventListener('icecandidate', onIceCandidate)
    })
    await promise
  }

  static close():void {
    this.getConnections().forEach(connection => { this.deleteConnection(connection) })
  }

  static connectionsById = new Map<string, WebcamConnection>()

  static callbacksByConnection = new Map<WebcamConnection, () => void>()

  static async createConnection(outputPrefix?: string, outputOptions?: CommandOutputOptions): Promise<WebcamConnection> {
    const id = this.createId()
    const connection = new WebcamConnection(id, outputPrefix, outputOptions)

    console.log(this.constructor.name, "createConnection", connection.constructor.name, id)

    const closedListener = () => { this.deleteConnection(connection) }
    this.callbacksByConnection.set(connection, closedListener)
    connection.once('closed', closedListener)

    this.connectionsById.set(connection.id, connection)

    await connection.doOffer()
    return connection
  }

  static createId():string {
    do {
      const id = uuid()
      if (!this.connectionsById.has(id)) return id

    } while (true)
  }

  static deleteConnection(connection: WebcamConnection):void {
    this.connectionsById.delete(connection.id)

    const closedListener = this.callbacksByConnection.get(connection)

    console.log(this.constructor.name, "deleteConnection", connection.id, !!closedListener)
    if (!closedListener) return

    this.callbacksByConnection.delete(connection)
    connection.removeListener('closed', closedListener)
  }

  static getConnection(id:string):WebcamConnection | null {
    return this.connectionsById.get(id) || null
  }

  static getConnections(): WebcamConnection[] {
    return [...this.connectionsById.values()]
  }

  static toJSON():ConnectionJson[] {
    return this.getConnections().map(connection => connection.toJSON())
  }
}

export { WebcamConnection }
