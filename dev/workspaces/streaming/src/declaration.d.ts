import Express from 'express'

export interface ConnectionJson {
  iceConnectionState: RTCIceConnectionState,
  id: string,
  localDescription: RTCSessionDescription | null,
  remoteDescription: RTCSessionDescription | null,
  signalingState: RTCSignalingState
  state: string,
}

export interface Server {
  stop() : void
  start(app: Express.Application): void
}
