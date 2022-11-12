import React from "react"
import { assertPopulatedString, ClassCollapsed, ServerType } from "@moviemasher/moviemasher.js"

import { PropsAndChildren, WithClassName } from "../../declarations"
import { WebrtcContext, WebrtcContextInterface } from "./WebrtcContext"
import { ApiContext } from "../ApiClient/ApiContext"
import { View } from "../../Utilities/View"
import { WebrtcClient } from "./WebrtcClient"
import { CollapseContext, CollapseContextInterface } from "../Collapse/CollapseContext"

export interface WebrtcProps extends PropsAndChildren, WithClassName {
  initialPicked?: string
  initialCollapsed?: boolean
}

export function Webrtc(props: WebrtcProps) {
  const { 
    initialPicked = 'settings', 
    initialCollapsed = false, 
    className,
    ...rest 
  } = props

  const [collapsed, setCollapsed] = React.useState(initialCollapsed)
  const [broadcasting, setBroadcasting] = React.useState(false)
  const [client, setClient] = React.useState<WebrtcClient | undefined>()
  const apiContext = React.useContext(ApiContext)
  
  const { enabled, servers } = apiContext
  const [ picked, setPicked] = React.useState(initialPicked) 
  const [audioDeviceId, setAudioDeviceId] = React.useState('')
  const [videoDeviceId, setVideoDeviceId] = React.useState('')
  const [mediaStream, setMediaStream] = React.useState<MediaStream>()

  if (!(enabled && servers[ServerType.Streaming])) return null
  const pick = (id: string) => {
    assertPopulatedString(id)
    setPicked(id)
  }

  const context: WebrtcContextInterface = { 
    broadcasting, setBroadcasting,
    client, setClient, pick, picked, mediaStream, setMediaStream,
    audioDeviceId, setAudioDeviceId, videoDeviceId, setVideoDeviceId,
  }
  const collapseContext: CollapseContextInterface = { 
    collapsed, changeCollapsed: setCollapsed 
  }

  const classes: string[] = []
  if (className) classes.push(className)
  if (collapsed) classes.push(ClassCollapsed)

  const viewProps = { ...rest, className: classes.join(' ') }

  return (
    <WebrtcContext.Provider value={context}>
      <CollapseContext.Provider value={collapseContext}>
        <View { ...viewProps } />
      </CollapseContext.Provider>
    </WebrtcContext.Provider>

  )
}
