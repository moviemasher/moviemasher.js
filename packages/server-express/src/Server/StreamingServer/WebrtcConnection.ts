import fs from 'fs'
import EventEmitter from 'events'
import path from 'path'
import internal, { PassThrough } from 'stream'
import {
  Any, CommandOutput, outputDefaultHls, OutputFormat, CommandInput, Timeout
} from '@moviemasher/moviemasher.js'

import { ConnectionJson } from '../../declaration'
import { StreamInput, StreamOutput } from '../../UnixStream/SocketStreams'
import { RunningCommand } from '../../RunningCommand/RunningCommand'
import { RunningCommandFactory } from '../../RunningCommand/RunningCommandFactory'

const wrtc = require('wrtc')
const { RTCPeerConnection } = wrtc
const { RTCAudioSink, RTCVideoSink } = wrtc.nonstandard
const FilterGraphPadding = 6
const StreamPadding = 4

interface WebrtcStream {
  command: RunningCommand
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

class WebrtcConnection extends EventEmitter {
  constructor(id: string, outputPrefix?: string, commandOutput?: CommandOutput) {
    super()
    this.id = id
    this.state = 'open'
    if (commandOutput) this.commandOutput = commandOutput
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

  connectionTimer?: Timeout = setTimeout(() => {
    if (this.peerConnection.iceConnectionState !== 'connected'
      && this.peerConnection.iceConnectionState !== 'completed') {
      this.close()
    }
  }, TIME_TO_CONNECTED)

  async doOffer(): Promise<void> {
    console.log("doOffer")
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

  inputAudio(audio: internal.Stream): CommandInput {
    return {
      source: StreamInput(audio, this.id, 'audio').url,
      options: {f: 's16le', ar: '48k', ac: 1 }
    }
  }

  inputVideo(video: internal.Stream, size: string): CommandInput {
    return {
      source: StreamInput(video, this.id, 'video').url,
      options: {
        f: 'rawvideo',
        pix_fmt: 'yuv420p',
        s: size,
        r: '30',
      }
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

  commandOutput: CommandOutput = outputDefaultHls()

  outputPrefix = './temporary/streams/webrtc'

  _peerConnection: RTCPeerConnection | undefined

  get peerConnection(): RTCPeerConnection {
    if (this._peerConnection) return this._peerConnection

    const connection = <RTCPeerConnection> new RTCPeerConnection({ sdpSemantics: 'unified-plan' })
    connection.addEventListener('iceconnectionstatechange', this.onIceConnectionStateChange)
    this._peerConnection = connection
    return connection
  }

  reconnectionTimer?: Timeout

  get remoteDescription(): RTCSessionDescription | null {
    return this.peerConnection.remoteDescription
  }

  get signalingState():RTCSignalingState {
    return this.peerConnection.signalingState
  }

  state: string

  get stream(): WebrtcStream | undefined { return this.streams[0] }

  streamForDimensions(width: number, height: number): WebrtcStream {
    const size = width + 'x' + height
    const currentStream = this.stream
    if (currentStream && currentStream.size === size) return currentStream

    //console.log("streamForDimensions!!", width, height)

    const prefix = path.resolve(this.outputPrefix, this.id)
    fs.mkdirSync(prefix, { recursive: true })

    const video = new PassThrough()
    const audio = new PassThrough()

    let destination = ''

    const { commandOutput } = this

    const streamsPrefix = String(this.streams.length).padStart(StreamPadding, '0')

    switch (commandOutput.format) {
      case OutputFormat.Hls: {
        destination = `${prefix}/${streamsPrefix}-${size}.m3u8`
        const { options } = commandOutput
        if (options && !Array.isArray(options)) {
          options.hls_segment_filename = `${prefix}/${size}-%0${FilterGraphPadding}d.ts`
        }
        break
      }
      case OutputFormat.Flv: {
        destination = `${prefix}/${streamsPrefix}-${size}.flv`
        break
      }
      case OutputFormat.Rtmp: {
        destination = 'rtmps://...'
        break
      }
      // case OutputFormat.Pipe: {
      //   const combined = new PassThrough()
      //   destination = StreamOutput(combined, this.id).url
      // }
    }

    const command = RunningCommandFactory.instance(this.id, {
      inputs: [this.inputVideo(video, size), this.inputAudio(audio)],
      graphFilters: [],
      output: commandOutput
    })

    const webrtcStream = {
      destination,
      size,
      video,
      audio,
      command,
    }

    this.streams.unshift(webrtcStream)

    webrtcStream.command.run(destination)

    return webrtcStream
  }

  streams: WebrtcStream[] = []

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

  static connectionsById = new Map<string, WebrtcConnection>()

  static callbacksByConnection = new Map<WebrtcConnection, () => void>()

  static create(id: string, outputPrefix?: string, commandOutput?: CommandOutput): WebrtcConnection {
    const connection = new WebrtcConnection(id, outputPrefix, commandOutput)
    console.log(this.constructor.name, "createConnection", connection.constructor.name, id)

    const closedListener = () => { this.deleteConnection(connection) }
    this.callbacksByConnection.set(connection, closedListener)
    connection.once('closed', closedListener)

    this.connectionsById.set(connection.id, connection)

    return connection
  }

  static deleteConnection(connection: WebrtcConnection):void {
    this.connectionsById.delete(connection.id)

    const closedListener = this.callbacksByConnection.get(connection)

    console.log(this.constructor.name, "deleteConnection", connection.id, !!closedListener)
    if (!closedListener) return

    this.callbacksByConnection.delete(connection)
    connection.removeListener('closed', closedListener)
  }

  static getConnection(id:string):WebrtcConnection | null {
    return this.connectionsById.get(id) || null
  }

  static getConnections(): WebrtcConnection[] {
    return [...this.connectionsById.values()]
  }

  static toJSON():ConnectionJson[] {
    return this.getConnections().map(connection => connection.toJSON())
  }
}

export { WebrtcConnection, WebrtcStream, AudioData, FrameData }
