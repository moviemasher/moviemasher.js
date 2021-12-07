import React from 'react'
import { UnknownObject } from '@moviemasher/moviemasher.js'
import { WebrtcContext } from '../../Contexts/WebrtcContext'
import { VideoView, VideoViewProps } from '../../Utilities/VideoView'

interface WebrtcContentProps extends UnknownObject {
  children?: never
}

const WebrtcContent: React.FunctionComponent<WebrtcContentProps> = (props) => {
  const ref = React.useRef<HTMLVideoElement>(null)

  const webrtcContext = React.useContext(WebrtcContext)
  const { webrtcClient, broadcasting } = webrtcContext

  const removeListeners = () => {
    // const { eventTarget } = webrtcClient
    // eventTarget.removeEventListener(EventType.Draw, handleDraw)
  }

  const addListeners = () => {
    // const { eventTarget } = webrtcClient
    // eventTarget.addEventListener(EventType.Draw, handleDraw)
    return () => { removeListeners() }
  }

  const { current } = ref
  if (current) current.srcObject = broadcasting ? webrtcClient.localStream || null : null

  React.useEffect(() => addListeners(), [])
  const { children, selectClass, ...rest } = props
  const videoProps: VideoViewProps = {
    ...rest,
    ref, autoPlay: true, muted: true,
  }

  return <VideoView { ...videoProps } />
}

export { WebrtcContent }
