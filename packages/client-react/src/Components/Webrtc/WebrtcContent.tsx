import React from 'react'

import { PropsWithoutChild, ReactResult } from '../../declarations'
import { WebrtcContext } from '../../Contexts/WebrtcContext'
import { VideoView } from '../../Utilities/VideoView'
import { ProcessContext } from '../../Contexts/ProcessContext'

export interface WebrtcContentProps extends PropsWithoutChild {}

export function WebrtcContent(props: WebrtcContentProps): ReactResult {
  const ref = React.useRef<HTMLVideoElement>(null)

  const webrtcContext = React.useContext(WebrtcContext)
  const processContext = React.useContext(ProcessContext)
  const { client } = webrtcContext
  const { processing } = processContext

  const removeListeners = () => {
    // const { eventTarget } = client
    // eventTarget.removeEventListener(EventType.Draw, handleDraw)
  }

  const addListeners = () => {
    // const { eventTarget } = client
    // eventTarget.addEventListener(EventType.Draw, handleDraw)
    return () => { removeListeners() }
  }

  const { current } = ref
  if (current) current.srcObject = processing ? client?.localStream || null : null

  React.useEffect(() => addListeners(), [])
  const { children:_, ...rest } = props
  const videoProps = {
    ...rest,
    ref, autoPlay: true, muted: true,
  }

  return <VideoView { ...videoProps } />
}
