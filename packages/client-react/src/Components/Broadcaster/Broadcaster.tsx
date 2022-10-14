import React from 'react'

import { PropsAndChildren, ReactResult, WithClassName } from '../../declarations'
import { ViewerContext, ViewerContextInterface } from '../../Contexts/ViewerContext'
import { View } from '../../Utilities/View'

export interface BroadcasterProps extends PropsAndChildren, WithClassName {}

/**
 * @parents Masher
 * @children StreamerContent, StreamerControl, StreamerPreloadControl, StreamerUpdateControl
 */
export function Broadcaster(props: BroadcasterProps): ReactResult {
  const [streaming, setStreaming] = React.useState(false)
  const [preloading, setPreloading] = React.useState(false)
  const [updating, setUpdating] = React.useState(false)
  const [id, setId] = React.useState('')
  const [url, setUrl] = React.useState('')
  const [width, setWidth] = React.useState(0)
  const [height, setHeight] = React.useState(0)
  const [videoRate, setVideoRate] = React.useState(0)

  const context: ViewerContextInterface = {
    updating, setUpdating,
    videoRate, setVideoRate,
    height, setHeight,
    width, setWidth,
    url, setUrl,
    streaming,
    setStreaming,
    preloading, setPreloading,
    id, setId,
  }

  return (
    <ViewerContext.Provider value={context}>
      <View {...props}/>
    </ViewerContext.Provider>
  )
}
