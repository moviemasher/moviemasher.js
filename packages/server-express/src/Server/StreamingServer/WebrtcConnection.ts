import fs from 'fs'
import EventEmitter from 'events'
import path from 'path'
import internal, { PassThrough } from 'stream'
import wrtc from 'wrtc'

import {
  OutputFormat, CommandInput, Timeout, AVType, Size, sizesEqual, CommandOutput
} from '@moviemasher/moviemasher.js'

import { ConnectionJson } from '../../declarations'
import { StreamInput } from '../../UnixStream/SocketStreams'
import { RunningCommand, outputDefaultHls, runningCommandInstance } from '@moviemasher/server-core'

// const  = require('wrtc')
const { RTCPeerConnection } = wrtc
const { RTCAudioSink, RTCVideoSink } = wrtc.nonstandard
const FilterGraphPadding = 6
const StreamPadding = 4

export interface WebrtcStream {
  command: RunningCommand
  destination: string
  size: Size
  video: PassThrough
  audio: PassThrough
  end?: boolean
}

export interface AudioData {
  samples: {
    buffer: ArrayBuffer
  }
}

export interface FrameData extends EventListenerObject {
  frame: {
    width: number
    height: number
    data: ArrayBuffer
  }
}

const TIME_TO_CONNECTED = 10000
const TIME_TO_HOST_CANDIDATES = 2000
const TIME_TO_RECONNECTED = 10000

export class WebrtcConnection extends EventEmitter {
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

  dataLengths = new Set<number>()
  frameCount = 0
  sizes = new Set<string>()

  interval = setInterval(() => {
    const { frameCount } = this
    if (!frameCount) return 

    console.log(frameCount, [...this.dataLengths].join(', '), [...this.sizes].join(', '))
    this.frameCount = 0
    this.dataLengths.clear()
    this.sizes.clear()
  }, 1000)

  async applyAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
    console.log(this.constructor.name, "applyAnswer calling setRemoteDescription", answer.sdp)//

    await this.peerConnection.setRemoteDescription(answer)
  }

  private beforeOffer():void {
    console.log(this.constructor.name, "beforeOffer")

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

  createAudioSink(): any {
    const audioTransceiver = this.peerConnection.addTransceiver('audio')
    return new RTCAudioSink(audioTransceiver.receiver.track)

  }

  createVideoSink(): any {
    const videoTransceiver = this.peerConnection.addTransceiver('video')
    return new RTCVideoSink(videoTransceiver.receiver.track)
  }

  close(): void {
    console.log(this.constructor.name, "close")

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
    const { iceConnectionState } = this.peerConnection
    if (iceConnectionState !== 'connected' && iceConnectionState !== 'completed') {
      console.log(this.constructor.name, "connectionTimer TIMED OUT", TIME_TO_CONNECTED, iceConnectionState)
      this.close()
    }
  }, TIME_TO_CONNECTED)

  async doOffer(): Promise<void> {
    console.log(this.constructor.name, "doOffer...")
    const options: RTCOfferOptions = {
      iceRestart: false,
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    }
    const offer = await this.peerConnection.createOffer(options)
    console.log(this.constructor.name, "doOffer... created offer")//, offer.sdp
    await this.peerConnection.setLocalDescription(offer)
    console.log(this.constructor.name, "doOffer... setLocalDescription")
    try {
      await this.waitUntilIceGatheringStateComplete()
      console.log(this.constructor.name, "doOffer... waitUntilIceGatheringStateComplete DONE")
    } catch (error) {
      console.log(this.constructor.name, "doOffer... waitUntilIceGatheringStateComplete ERROR", error)
      this.close()
      throw error
    }
  }

  get iceConnectionState():RTCIceConnectionState {
    const state = this.peerConnection.iceConnectionState
    console.log(this.constructor.name, "iceConnectionState", state)

    return state
  }

  id: string

  inputAudio(audio: internal.Stream): CommandInput {
    return {
      source: StreamInput(audio, this.id, 'audio').url,
      options: { f: 's16le', ar: '48k', ac: 1 }
    }
  }

  inputVideo(video: internal.Stream, size: Size): CommandInput {
    const { width, height } = size
    const streamInput = StreamInput(video, this.id, 'video')
    const { server } = streamInput

    server.addListener('listening', () => {

    })
    return {
      source: streamInput.url,
      options: {
        f: 'rawvideo',
        pix_fmt: 'yuv420p',
        s: `${width}x${height}`,
        r: '30',
      }
    }
  }

  get localDescription(): RTCSessionDescription | null {
    const { peerConnection } = this
    
    
    const description = peerConnection.localDescription
    if (!description) return description

    const { sdp, ...rest } = description // a=ice-options:trickle
    
    const replaced = { ...rest, sdp: sdp.replaceAll("\r\na=ice-options:trickle", '') }//
    console.log(this.constructor.name, "localDescription", replaced.type, replaced.sdp.includes('trickle'))
    return replaced
  }

  onAudioData({ samples: { buffer } }: AudioData): void {
    // console.log("onAudioData...")
    if (!this.stream || this.stream.end) {
      // console.log(this.constructor.name, "onAudioData", this.stream?.end)
      return
    }

    this.stream.audio.push(Buffer.from(buffer))
    // console.log("onAudioData!")
  }

  onFrameData(frameData: FrameData): void {
    const { frame: { width, height, data } } = frameData

    this.frameCount += 1
    this.sizes.add([width, height].join("x"))
    this.dataLengths.add(data.byteLength)
    // console.log("onFrameData", width, height, data.byteLength)
    const stream = this.streamForSize({ width, height })

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
    const { iceConnectionState } = this.peerConnection
    console.log(this.constructor.name, "onIceConnectionStateChange...", iceConnectionState)
    if (['connected', 'completed'].includes(iceConnectionState)) {
      if (this.connectionTimer) {
        console.log(this.constructor.name, "onIceConnectionStateChange clearing connectionTimer")

        clearTimeout(this.connectionTimer)
        this.connectionTimer = undefined
      }
      if (this.reconnectionTimer) {
        console.log(this.constructor.name, "onIceConnectionStateChange clearing reconnectionTimer")
        clearTimeout(this.reconnectionTimer)
        this.reconnectionTimer = undefined
      }
    } else if (iceConnectionState === 'disconnected' || iceConnectionState === 'failed') {
      if (!this.connectionTimer && !this.reconnectionTimer) {
        this.reconnectionTimer = setTimeout(() => { 
          console.log(this.constructor.name, "onIceConnectionStateChange creating reconnectionTimer")
          this.close() 
        }, TIME_TO_RECONNECTED)
      }
    }
    console.log(this.constructor.name, "onIceConnectionStateChange!")
  }

  commandOutput: CommandOutput = outputDefaultHls()

  outputPrefix = './temporary/streams/webrtc'

  _peerConnection: RTCPeerConnection | undefined

  get peerConnection(): RTCPeerConnection {
    if (this._peerConnection) return this._peerConnection

    const args = { 
      sdpSemantics: 'unified-plan', 
      portRange: {
        min: 10000, // defaults to 0
        max: 10100  // defaults to 65535
      } 
    }
    const connection = new RTCPeerConnection(args)
    connection.addEventListener('iceconnectionstatechange', this.onIceConnectionStateChange)
    this._peerConnection = connection
    return connection
  }

  reconnectionTimer?: Timeout

  get remoteDescription(): RTCSessionDescription | null {
    const description = this.peerConnection.remoteDescription
    console.log(this.constructor.name, "remoteDescription")//, description?.sdp

    return description
  }

  get signalingState():RTCSignalingState {
    return this.peerConnection.signalingState
  }

  state: string

  get stream(): WebrtcStream | undefined { return this.streams[0] }

  streamForSize(size: Size): WebrtcStream {
    const { width, height } = size
    const currentStream = this.stream
    if (currentStream && sizesEqual(currentStream.size, size)) return currentStream

    const widthAndHeight = [width, height].join('x')
    console.log(this.constructor.name, "streamForSize", width, height)

    const prefix = path.resolve(this.outputPrefix, this.id)
    fs.mkdirSync(prefix, { recursive: true })

    const video = new PassThrough()
    const audio = new PassThrough()

    let destination = ''

    const { commandOutput } = this

    const streamsPrefix = String(this.streams.length).padStart(StreamPadding, '0')

    switch (commandOutput.format) {
      case OutputFormat.Hls: {
        destination = `${prefix}/${streamsPrefix}-${widthAndHeight}.m3u8`
        const { options } = commandOutput
        if (options && !Array.isArray(options)) {
          options.hls_segment_filename = `${prefix}/${widthAndHeight}-%0${FilterGraphPadding}d.ts`
        }
        break
      }
      default: {
      // case OutputFormat.Flv: {
      //   destination = `${prefix}/${streamsPrefix}-${widthAndHeight}.flv`
      //   break
      // }
      // case OutputFormat.Rtmp: {
        destination = 'rtp://54.82.176.97:8579'
        break
      }

      // ./ffmpeg -re -i <source_file> -c copy -map 0 -f rtp_mpegts -fec prompeg=l=5:d=20
      // rtp://<IP>:5000


      // case OutputFormat.Pipe: {
      //   const combined = new PassThrough()
      //   destination = StreamOutput(combined, this.id).url
      // }
    }

    console.log(this.constructor.name, "streamForSize commandOutput", commandOutput)
  

    const command = runningCommandInstance(this.id, {
      inputs: [
        this.inputVideo(video, size), this.inputAudio(audio)
      ],
      commandFilters: [],
      output: commandOutput, avType: AVType.Both
    })

    const webrtcStream: WebrtcStream = {
      destination,
      size,
      video,
      audio,
      command,
    }

    this.streams.unshift(webrtcStream)

    // webrtcStream.command.run(destination)

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
    console.log(this.constructor.name, "waitUntilIceGatheringStateComplete", this.peerConnection.iceGatheringState)

    if (this.peerConnection.iceGatheringState === 'complete') return

    const promise = new Promise<void>((resolve, reject) => {
      const onIceCandidate = (event: RTCPeerConnectionIceEvent) => {
        const { candidate } = event
        
        if (!candidate) {
          console.log(this.constructor.name, "waitUntilIceGatheringStateComplete.onIceCandidate NO CANDIDATE so resolving")
          clearTimeout(timeout)
          this.peerConnection.removeEventListener('icecandidate', onIceCandidate)
          resolve()
        } else {
          console.log(this.constructor.name, "waitUntilIceGatheringStateComplete.onIceCandidate CANDIDATE", candidate.protocol, candidate.port, candidate.candidate)
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
    console.log(this.name, "create", connection.constructor.name, id)

    const closedListener = () => { this.deleteConnection(connection) }
    this.callbacksByConnection.set(connection, closedListener)
    connection.once('closed', closedListener)

    this.connectionsById.set(connection.id, connection)

    return connection
  }

  static deleteConnection(connection: WebrtcConnection):void {
    this.connectionsById.delete(connection.id)

    const closedListener = this.callbacksByConnection.get(connection)

    console.log(this.name, "deleteConnection", connection.id, !!closedListener)
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
