import React from 'react'
import { UnknownObject } from '@moviemasher/moviemasher.js'
import { WebcamContext } from './WebcamContext'
import { VideoView, VideoViewProps } from '../../Utilities/VideoView'

interface WebcamContentProps extends UnknownObject {
  children?: never
}

const WebcamContent: React.FunctionComponent<WebcamContentProps> = (props) => {
  const ref = React.useRef<HTMLVideoElement>(null)

  const streamerContext = React.useContext(WebcamContext)
  const { streamerClient, streaming } = streamerContext

  const removeListeners = () => {
    // const { eventTarget } = streamerClient
    // eventTarget.removeEventListener(EventType.Draw, handleDraw)
  }

  const addListeners = () => {
    // const { eventTarget } = streamerClient
    // eventTarget.addEventListener(EventType.Draw, handleDraw)
    return () => { removeListeners() }
  }

  const { current } = ref
  if (current) current.srcObject = streaming ? streamerClient.localStream || null : null

  React.useEffect(() => addListeners(), [])
  const { children, selectClass, ...rest } = props
  const videoProps: VideoViewProps = {
    ...rest,
    ref, autoPlay: true, muted: true,
  }

  return <VideoView { ...videoProps } />
}

export { WebcamContent }
