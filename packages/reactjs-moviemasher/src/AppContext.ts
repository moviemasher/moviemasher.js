import { MutableRefObject, createContext } from 'react'
import {
  BooleanSetter,
  NumberSetter,
  Time,
  TimeRange,
  TrackRange,
  Clip,
  ScrollMetrics,
  MovieMasher,
  Masher
} from '@moviemasher/moviemasher.js'


const AppContextDefaultSetters = {
  number: (value: number) => {},
  boolean: (value: boolean) => {},
  time: (value: Time) => {},
}

interface AppContextInterface {
  audioTracks: number
  counter: number
  masher : Masher
  paused: boolean,
  previewReference?: MutableRefObject<HTMLCanvasElement | undefined>
  quantize: number
  selectedClipIdentifier: string
  selectedEffectIdentifier: string
  setPaused: BooleanSetter
  setTime: (value : Time) => void
  setVolume: NumberSetter
  timeRange : TimeRange // in masher fps
  videoTracks: number
  volume: number
}
const AppContextDefault: AppContextInterface = {
  audioTracks: 0,
  counter: 0,
  masher: MovieMasher.masher.instance(),
  paused: false,
  quantize: 0,
  selectedClipIdentifier: '',
  selectedEffectIdentifier: '',
  setPaused: AppContextDefaultSetters.boolean,
  setTime: AppContextDefaultSetters.time,
  setVolume: AppContextDefaultSetters.number,
  timeRange: TimeRange.fromArgs(),
  videoTracks: 0,
  volume: 0,
}

const AppContext = createContext(AppContextDefault)
const AppContextProvider = AppContext.Provider

export { AppContext, AppContextProvider, AppContextInterface, AppContextDefault }
