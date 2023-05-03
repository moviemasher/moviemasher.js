import type {
 Scalar, PropertiedChangeHandler, Property, Time, 
} from '@moviemasher/lib-core'

import { 
  EmptyFunction, DataTypeString 
} from '@moviemasher/lib-core'
import { createContext } from '../../../Framework/FrameworkFunctions'

export interface InputContextInterface {
  property: Property
  name: string
  value: Scalar
  defaultValue?: Scalar
  changeHandler: PropertiedChangeHandler
  time?: Time
}

export const InputContextDefault: InputContextInterface = {
  changeHandler: EmptyFunction,
  value: '',
  name: '',
  property: { type: DataTypeString, name: '', defaultValue: '' }
}

export const InputContext = createContext(InputContextDefault)
