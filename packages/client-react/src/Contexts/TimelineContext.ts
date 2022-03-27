import React from 'react'
import { NumberSetter } from '@moviemasher/moviemasher.js'


interface TimelineContextInterface {
  height : number
  setHeight: NumberSetter
  setWidth: NumberSetter
  setZoom: NumberSetter
  width : number
  zoom: number
}

const TimelineContextDefault: TimelineContextInterface = {
  height: 0,
  setHeight: () => {},
  setWidth: () => {},
  setZoom: () => {},
  width: 0,
  zoom : 0,
}

const TimelineContext = React.createContext(TimelineContextDefault)

export { TimelineContext, TimelineContextInterface, TimelineContextDefault }
