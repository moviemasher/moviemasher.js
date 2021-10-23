import React, { useContext } from 'react'
import { EventType, UnknownObject } from '@moviemasher/moviemasher.js'

import { View } from '../../Utilities/View'
import { TimelineContext, TimelineContextInterface } from './TimelineContext'
import { MMContext } from '../App/MMContext'

interface TimelineProps extends UnknownObject { children : React.ReactNode }

const MMTimeline: React.FC<TimelineProps> = props => {
  const [zoom, setZoom] = React.useState(0)
  const [width, setWidth] = React.useState(0)
  const [height, setHeight] = React.useState(0)
  const appContext = useContext(MMContext)
  const [canvas, setCanvas] = React.useState<HTMLCanvasElement | null>(null)
  const [actionNonce, setActionNonce] = React.useState(0)

  const handleAction = () => { setActionNonce(nonce => nonce + 1) }

  const listenCanvas = (value?: HTMLCanvasElement) => {
    if (canvas) canvas.removeEventListener(EventType.Action, handleAction)
    if (value) {
      value.addEventListener(EventType.Action, handleAction)
      setCanvas(value)
    }
  }

  const timelineContext : TimelineContextInterface = {
    setZoom,
    setWidth,
    setHeight,
    zoom,
    width,
    height,
    actionNonce,
  }
  const { previewReference } = appContext
  const { children, ...rest } = props

  React.useEffect(() => {
    const { current: currentPreview } = previewReference || {}
    if (currentPreview) listenCanvas(currentPreview)
    return () => { listenCanvas() }
  }, [])

  return <View {...rest}>
    <TimelineContext.Provider value={timelineContext} children={children} />
  </View>
}


export { MMTimeline }
