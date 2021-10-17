import React from 'react'
import { TrackType } from '@moviemasher/moviemasher.js'

interface TrackContextInterface {
  type: TrackType
  index: number
  // perFrame: number
}

const TrackContextDefault: TrackContextInterface = {
  type: TrackType.Video,
  index: 0,
  // perFrame: 0,
}

const TrackContext = React.createContext(TrackContextDefault)
const TrackContextProvider = TrackContext.Provider

export { TrackContext, TrackContextProvider, TrackContextInterface, TrackContextDefault }
