import { createContext } from 'react'
import {
  NumberSetter,
} from '@moviemasher/moviemasher.js'


interface TimelineContextInterface {
  actionNonce: number
  height : number
  setHeight: NumberSetter
  setWidth: NumberSetter
  setZoom: NumberSetter
  width : number
  zoom: number
}

const TimelineContextDefault: TimelineContextInterface = {
  actionNonce: 0,
  height: 0,
  setHeight: () => {},
  setWidth: () => {},
  setZoom: () => {},
  width: 0,
  zoom : 0,
}

const TimelineContext = createContext(TimelineContextDefault)

export { TimelineContext, TimelineContextInterface, TimelineContextDefault }
