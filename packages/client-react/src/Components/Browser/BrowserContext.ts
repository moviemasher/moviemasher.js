import React from 'react'
import { 
  Definition, DefinitionType, EmptyMethod, MediaDefinitionType, Medias, StringSetter, VoidMethod 
} from '@moviemasher/moviemasher.js'

export interface BrowserContextInterface {
  refresh: VoidMethod
  addPicker:(id: string, types: MediaDefinitionType[]) => void
  definitions: Medias
  pick: StringSetter
  picked: string,
  removePicker:(id: string) => void
}

export const BrowserContextDefault: BrowserContextInterface = {
  addPicker: EmptyMethod,
  refresh: EmptyMethod,
  definitions: [],
  pick: EmptyMethod,
  picked: '',
  removePicker: EmptyMethod,
}

export const BrowserContext = React.createContext(BrowserContextDefault)
