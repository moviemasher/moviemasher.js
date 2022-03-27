import React from 'react'
import { CastEditor } from '@moviemasher/moviemasher.js'

interface CasterContextInterface {
  castEditor?: CastEditor
}

const CasterContextDefault: CasterContextInterface = {}

const CasterContext = React.createContext(CasterContextDefault)

export { CasterContext, CasterContextInterface, CasterContextDefault }
