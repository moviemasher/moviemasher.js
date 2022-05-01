import React from 'react'
import { Definition, StringSetter } from '@moviemasher/moviemasher.js'
import { ReactStateSetter } from '../declarations'

export interface BrowserContextInterface {
  definitions?: Definition[]
  definitionId: string
  setDefinitions: (value?: Definition[]) => void
  setDefinitionId: StringSetter
  setSourceId: ReactStateSetter<string>
  sourceId: string,
}

export const BrowserContextDefault: BrowserContextInterface = {
  definitions: [],
  definitionId: '',
  setDefinitions: () => {},
  setDefinitionId: () => {},
  setSourceId: () => {},
  sourceId: '',
}

export const BrowserContext = React.createContext(BrowserContextDefault)
