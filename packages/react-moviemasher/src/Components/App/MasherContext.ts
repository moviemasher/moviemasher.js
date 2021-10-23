import React from 'react'
import { NumberSetter } from '@moviemasher/moviemasher.js'

interface MasherContextInterface {
  frames: number
  frame: number
  selectedClipIdentifier: string
  selectedEffectIdentifier: string
  setFrame: NumberSetter
}
const MasherContextDefault: MasherContextInterface = {
  frame: 0,
  frames: 0,
  selectedClipIdentifier: '',
  selectedEffectIdentifier: '',
  setFrame: () => {},
}

const MasherContext = React.createContext(MasherContextDefault)
const MasherContextProvider = MasherContext.Provider

export {
  MasherContext,
  MasherContextProvider,
  MasherContextInterface,
  MasherContextDefault
}
