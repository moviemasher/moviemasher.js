import React from 'react'
import { TrackType } from '@moviemasher/moviemasher.js'

export interface TrackContextInterface {
  trackType: TrackType
  layer: number
}

export const TrackContextDefault: TrackContextInterface = {
  trackType: TrackType.Video,
  layer: 0,
}

export const TrackContext = React.createContext(TrackContextDefault)
export const TrackContextProvider = TrackContext.Provider
