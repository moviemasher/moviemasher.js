import React from 'react'
import { TrackType } from '@moviemasher/moviemasher.js'

interface TrackContextInterface {
  trackType: TrackType
  layer: number
}

const TrackContextDefault: TrackContextInterface = {
  trackType: TrackType.Video,
  layer: 0,
}

const TrackContext = React.createContext(TrackContextDefault)
const TrackContextProvider = TrackContext.Provider

export { TrackContext, TrackContextProvider, TrackContextInterface, TrackContextDefault }
