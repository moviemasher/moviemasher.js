import React from 'react'
import { Clip } from '@moviemasher/moviemasher.js'

export interface ClipContextInterface {
  prevClipEnd: number
  clip?: Clip
}

export const ClipContextDefault: ClipContextInterface = {
  prevClipEnd: 0
}

export const ClipContext = React.createContext(ClipContextDefault)
