import React from 'react'
import { PropsWithoutChild, ReactResult } from "../../declarations"
import { useStreamEditor } from '../../Hooks/useStreamEditor'

interface ViewerContentProps extends PropsWithoutChild {}
function ViewerContent(props: ViewerContentProps): ReactResult {
  const streamer = useStreamEditor()
  const { streamUrl } = streamer
  if (!streamUrl) return null

  const videoProps = { ...props }
  return <video src={streamUrl} { ...videoProps } />
}

export { ViewerContent, ViewerContentProps }
