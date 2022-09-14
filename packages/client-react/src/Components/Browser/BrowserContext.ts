import React from 'react'
import { 
  Definition, DefinitionType, EmptyMethod, StringSetter 
} from '@moviemasher/moviemasher.js'

export interface BrowserContextInterface {
  addPicker:(id: string, types: DefinitionType[]) => void
  definitions: Definition[]
  pick: StringSetter
  picked: string,
  removePicker:(id: string) => void
}

export const BrowserContextDefault: BrowserContextInterface = {
  addPicker: EmptyMethod,
  definitions: [],
  pick: EmptyMethod,
  picked: '',
  removePicker: EmptyMethod,
}

export const BrowserContext = React.createContext(BrowserContextDefault)
