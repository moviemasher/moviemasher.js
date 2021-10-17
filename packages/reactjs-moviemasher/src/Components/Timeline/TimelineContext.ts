import { createContext } from 'react'
import {
  NumberSetter,
} from '@moviemasher/moviemasher.js'


interface TimelineContextInterface {
  setZoom: NumberSetter
  setWidth: NumberSetter
  setHeight: NumberSetter
  width : number
  height : number
  zoom : number
}

const TimelineContextDefault: TimelineContextInterface = {
  setZoom: (value: number) => { },
  setWidth: (value: number) => { },
  setHeight: (value: number) => { },
  width: 0,
  height: 0,
  zoom : 0,
}

const TimelineContext = createContext(TimelineContextDefault)
const TimelineContextProvider = TimelineContext.Provider

export { TimelineContext, TimelineContextProvider, TimelineContextInterface, TimelineContextDefault }
