import { MutableRefObject, createContext } from 'react'
import {
  BooleanSetter,
  NumberSetter,
  Masher
} from '@moviemasher/moviemasher.js'

interface MMContextInterface {
  audioTracks: number
  masher? : Masher
  paused: boolean,
  previewReference?: MutableRefObject<HTMLCanvasElement | undefined>
  quantize: number
  setPaused: BooleanSetter
  setVolume: NumberSetter
  videoTracks: number
  volume: number
}
const MMContextDefault: MMContextInterface = {
  audioTracks: 0,
  paused: false,
  quantize: 0,
  setPaused: () => {},
  setVolume: () => {},
  videoTracks: 0,
  volume: 0,
}

const MMContext = createContext(MMContextDefault)

export { MMContext, MMContextInterface, MMContextDefault }
