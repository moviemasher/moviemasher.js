import React from 'react'
import { NumberSetter } from '@moviemasher/moviemasher.js'


export interface TimelineContextInterface {
  height : number
  setHeight: NumberSetter
  setWidth: NumberSetter
  setZoom: NumberSetter
  width : number
  zoom: number
}

export const TimelineContextDefault: TimelineContextInterface = {
  height: 0,
  setHeight: () => {},
  setWidth: () => {},
  setZoom: () => {},
  width: 0,
  zoom : 1,
}

export const TimelineContext = React.createContext(TimelineContextDefault)
