import { MutableRefObject, createContext } from 'react'
import {
  Visible,
  BooleanSetter,
  NumberSetter,
  Time,
  TimeRange,
  TrackRange,
  Clip
} from '@moviemasher/moviemasher.js'


interface AppContextInterface {
  clips: (timeRange? : TimeRange, trackRange? : TrackRange) => Clip[]
  paused: boolean,
  previewReference?: MutableRefObject<HTMLCanvasElement | undefined>
  quantize: number
  setPaused: BooleanSetter
  setTime: (value : Time) => void
  setVolume: NumberSetter
  setZoom: NumberSetter
  setTimelineWidth: NumberSetter
  timeRange : TimeRange
  timelineWidth: number
  timelineReference?: MutableRefObject<HTMLDivElement | undefined>
  audioTracks: number
  videoTracks: number
  volume: number
  zoom : number
}
const AppContextDefaultSetters = {
  number: (value: number) => { },
  boolean: (value: boolean) => { },
  time: (value: Time) => { },
}
const AppContextDefault : AppContextInterface = {
  clips: (timeRange?, trackRange?) => [],
  paused: false,
  quantize: 0,
  setPaused: AppContextDefaultSetters.boolean,
  setVolume: AppContextDefaultSetters.number,
  setZoom: AppContextDefaultSetters.number,
  setTimelineWidth: AppContextDefaultSetters.number,
  setTime: AppContextDefaultSetters.time,
  audioTracks: 0,
  timelineWidth: 0,
  videoTracks: 0,
  volume: 0,
  timeRange: TimeRange.fromArgs(),
  zoom : 0,
}

const AppContext = createContext(AppContextDefault)
const AppContextProvider = AppContext.Provider

export { AppContext, AppContextProvider, AppContextInterface }
