import React from 'react'
import { Definition, DefinitionType, EmptyMethod, StringSetter } from '@moviemasher/moviemasher.js'
import { ReactStateSetter } from '../declarations'

export interface BrowserContextInterface {
  definitions?: Definition[]
  definitionId: string
  setDefinitions: (value?: Definition[]) => void
  setDefinitionId: StringSetter
  setSourceId: ReactStateSetter<string>
  sourceId: string,

  selectedTypes: DefinitionType[]
  changeType: StringSetter
}

export const BrowserContextDefault: BrowserContextInterface = {
  definitions: [],
  definitionId: '',
  setDefinitions: () => {},
  setDefinitionId: () => {},
  setSourceId: () => {},
  sourceId: '',

  selectedTypes: [],
  changeType: EmptyMethod
}

export const BrowserContext = React.createContext(BrowserContextDefault)
