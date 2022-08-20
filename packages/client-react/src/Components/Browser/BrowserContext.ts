import React from 'react'
import { Definition, DefinitionType, DefinitionTypesObject, EmptyMethod, StringSetter } from '@moviemasher/moviemasher.js'
import { ReactStateSetter } from '../../declarations'

export interface BrowserContextInterface {
  addPicker:(id: string, types: DefinitionType[]) => void
  definitionId: string
  definitions?: Definition[]
  pick: StringSetter
  picked: string,
  removePicker:(id: string) => void
  changeDefinitionId: StringSetter
}

export const BrowserContextDefault: BrowserContextInterface = {
  addPicker: EmptyMethod,
  definitionId: '',
  definitions: [],
  pick: EmptyMethod,
  picked: '',
  removePicker: EmptyMethod,
  changeDefinitionId: EmptyMethod,
}

export const BrowserContext = React.createContext(BrowserContextDefault)
