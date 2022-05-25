import React from 'react'
import { Track } from '@moviemasher/moviemasher.js'

export interface TrackContextInterface {
  track?: Track
}

export const TrackContextDefault: TrackContextInterface = {}

export const TrackContext = React.createContext(TrackContextDefault)
