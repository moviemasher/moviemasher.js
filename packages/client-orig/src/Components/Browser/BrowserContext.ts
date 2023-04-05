
import { 
  EmptyFunction, MediaType, MediaArray, StringSetter, EmptyFunctionType 
} from '@moviemasher/lib-core'
import { createContext } from '../../Framework/FrameworkFunctions'

export interface BrowserContextInterface {
  refresh: EmptyFunctionType
  addPicker:(id: string, types: MediaType[]) => void
  definitions: MediaArray
  pick: StringSetter
  picked: string,
  removePicker:(id: string) => void
}

export const BrowserContextDefault: BrowserContextInterface = {
  addPicker: EmptyFunction,
  refresh: EmptyFunction,
  definitions: [],
  pick: EmptyFunction,
  picked: '',
  removePicker: EmptyFunction,
}

export const BrowserContext = createContext(BrowserContextDefault)
