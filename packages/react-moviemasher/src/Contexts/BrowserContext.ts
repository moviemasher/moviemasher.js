import React from 'react'
import { Definition, StringSetter } from '@moviemasher/moviemasher.js'

interface BrowserContextInterface {
  definitions?: Definition[]
  definitionId: string
  setDefinitions: (value?: Definition[]) => void
  setDefinitionId: StringSetter
  setSourceId: StringSetter
  sourceId: string,
}
const BrowserContextDefault: BrowserContextInterface = {
  definitions: [],
  definitionId: '',
  setDefinitions: () => {},
  setDefinitionId: () => {},
  setSourceId: () => {},
  sourceId: '',
}

const BrowserContext = React.createContext(BrowserContextDefault)

export { BrowserContext, BrowserContextInterface, BrowserContextDefault }
