import React from 'react'
import { Definition, StringSetter } from '@moviemasher/moviemasher.js'
import { ReactStateSetter } from '../declarations'

interface BrowserContextInterface {
  definitions?: Definition[]
  definitionId: string
  setDefinitions: (value?: Definition[]) => void
  setDefinitionId: StringSetter
  setSourceId: ReactStateSetter<string>
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
