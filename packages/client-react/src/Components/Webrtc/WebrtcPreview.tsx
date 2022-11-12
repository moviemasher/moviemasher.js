import React from 'react'

import { PropsWithoutChild, ReactResult } from '../../declarations'
import { WebrtcContext } from './WebrtcContext'
import { VideoView } from '../../Utilities/VideoView'
import { mediaStreamPromise } from '../../Utilities/MediaStream'
import { useEditor } from '../../Hooks/useEditor'
import { sizeAboveZero } from '@moviemasher/moviemasher.js'

export interface WebrtcPreviewProps extends PropsWithoutChild {}

export function WebrtcPreview(props: WebrtcPreviewProps): ReactResult {
  const ref = React.useRef<HTMLVideoElement>(null)
  const editor = useEditor()
  const webrtcContext = React.useContext(WebrtcContext)

  const { 
    mediaStream, setMediaStream, audioDeviceId, videoDeviceId
  } = webrtcContext

  React.useEffect(() => {
    mediaStreamPromise(audioDeviceId, videoDeviceId).then(stream => {
      
      console.log("WebrtcPreview useEffect setMediaStream", stream.id)
      setMediaStream(stream)
    })
    return () => { 
      console.log("WebrtcPreview useEffect callback setMediaStream undefined")
      setMediaStream(undefined)
    }
  }, [])
  const { current } = ref
  if (current && mediaStream) current.srcObject = mediaStream

  const { rect } = editor
  if (!sizeAboveZero(rect)) return null

  const { width, height } = rect
  const videoProps = {
    width, height,
    ...props, autoPlay: true, muted: true, ref
  }

  return <VideoView { ...videoProps } />
}
