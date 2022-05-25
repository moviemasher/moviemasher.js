import React from 'react'
import { Layer } from '@moviemasher/moviemasher.js'

export interface LayerContextInterface {
  layer?: Layer
  depth: number
}

export const LayerContextDefault: LayerContextInterface = { depth: 0 }

export const LayerContext = React.createContext(LayerContextDefault)
