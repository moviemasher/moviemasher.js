import Express from 'express'
import { UnknownObject } from "@moviemasher/moviemasher.js"

export interface ConnectionJson {
  iceConnectionState: RTCIceConnectionState,
  id: string,
  localDescription: RTCSessionDescription | null,
  remoteDescription: RTCSessionDescription | null,
  signalingState: RTCSignalingState
  state: string,
}


export type ServerHandler<T1, T2 = UnknownObject> = Express.RequestHandler<UnknownObject, T1, T2, UnknownObject, UnknownObject>
