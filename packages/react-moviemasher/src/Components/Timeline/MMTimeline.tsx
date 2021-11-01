import React, { useContext } from 'react'
import { EventType, UnknownObject } from '@moviemasher/moviemasher.js'

import { View } from '../../Utilities/View'
import { TimelineContext, TimelineContextInterface } from './TimelineContext'
import { EditorContext } from '../Editor/EditorContext'
import { Panel } from '../../declarations'


const MMTimeline: Panel = props => {
  const [zoom, setZoom] = React.useState(0)
  const [width, setWidth] = React.useState(0)
  const [height, setHeight] = React.useState(0)
  const appContext = useContext(EditorContext)
  const [canvas, setCanvas] = React.useState<HTMLCanvasElement | null>(null)


  const listenCanvas = (value?: HTMLCanvasElement) => {
    if (canvas) {

    }
    if (value) {
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
