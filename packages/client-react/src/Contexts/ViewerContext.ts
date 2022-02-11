import React from 'react'
import { BooleanSetter, NumberSetter, StringSetter } from '@moviemasher/moviemasher.js'

interface ViewerContextInterface {
  streaming: boolean
  preloading: boolean
  updating: boolean
  width: number
  height: number
  videoRate: number
  setWidth: NumberSetter
  setHeight: NumberSetter
  setVideoRate: NumberSetter
  setPreloading: BooleanSetter
  setUpdating: BooleanSetter
  setStreaming: BooleanSetter
  id: string
  setId: StringSetter
  url: string
  setUrl: StringSetter
}
const ViewerContextDefault: ViewerContextInterface = {
  width: 0,
  height: 0,
  videoRate: 0,
  streaming: false,
  updating: false,
  preloading: false,
  setPreloading: () => {},
  setStreaming: () => { },
  setWidth: () => { },
  setHeight: () => { },
  setVideoRate: () => { },
  setUpdating: () => { },
  setId: () => {},
  id: '',
  setUrl: () => {},
  url: '',
}

const ViewerContext = React.createContext(ViewerContextDefault)

export { ViewerContext, ViewerContextInterface, ViewerContextDefault }
