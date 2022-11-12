import { BooleanSetter, EmptyMethod, StringSetter } from '@moviemasher/moviemasher.js'
import React from 'react'

import { WebrtcClient } from './WebrtcClient'

export interface WebrtcContextInterface {
  broadcasting: boolean
  setBroadcasting: BooleanSetter
  picked: string
  pick: StringSetter
  audioDeviceId: string
  setAudioDeviceId: StringSetter
  setVideoDeviceId: StringSetter
  videoDeviceId: string
  client?: WebrtcClient
  mediaStream?: MediaStream
  setMediaStream: (stream: MediaStream | undefined) => void
  setClient: (client: WebrtcClient | undefined) => void
}

export const WebrtcContextDefault: WebrtcContextInterface = {
  setClient: () => {},
  picked: '',
  pick: EmptyMethod,
  broadcasting: false,
  setBroadcasting: EmptyMethod,
  setMediaStream: EmptyMethod,
  setAudioDeviceId: EmptyMethod,
  setVideoDeviceId: EmptyMethod,
  audioDeviceId: '',
  videoDeviceId: '',
}

export const WebrtcContext = React.createContext(WebrtcContextDefault)
