import React from 'react'
import { MashEditor } from '@moviemasher/moviemasher.js'

interface MasherContextInterface {
  mashEditor?: MashEditor
}

const MasherContextDefault: MasherContextInterface = {}

const MasherContext = React.createContext(MasherContextDefault)

export { MasherContext, MasherContextInterface, MasherContextDefault }
