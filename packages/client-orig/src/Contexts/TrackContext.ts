import { Track } from '@moviemasher/moviemasher.js'
import { createContext } from '../Framework/FrameworkFunctions'

export interface TrackContextInterface {
  track?: Track
}

export const TrackContextDefault: TrackContextInterface = {}

export const TrackContext = createContext(TrackContextDefault)