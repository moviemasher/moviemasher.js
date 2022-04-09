import React from 'react'
import { MashEditor } from '@moviemasher/moviemasher.js'

export interface MasherContextInterface {
  mashEditor?: MashEditor
}

export const MasherContextDefault: MasherContextInterface = {}

export const MasherContext = React.createContext(MasherContextDefault)
