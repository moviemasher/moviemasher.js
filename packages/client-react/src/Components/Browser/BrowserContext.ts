import React from 'react'
import { 
  EmptyMethod, MediaType, MediaArray, StringSetter, VoidMethod 
} from '@moviemasher/moviemasher.js'

export interface BrowserContextInterface {
  refresh: VoidMethod
  addPicker:(id: string, types: MediaType[]) => void
  definitions: MediaArray
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
