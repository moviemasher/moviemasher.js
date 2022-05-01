import React from 'react'
import { CastEditor } from '@moviemasher/moviemasher.js'

export interface CasterContextInterface {
  castEditor?: CastEditor
}

export const CasterContextDefault: CasterContextInterface = {}

export const CasterContext = React.createContext(CasterContextDefault)
