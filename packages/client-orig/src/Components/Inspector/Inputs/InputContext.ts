import { 
  Scalar, PropertiedChangeHandler, Property, DataType, Time, EmptyFunction 
} from "@moviemasher/lib-core"
import { createContext } from "../../../Framework/FrameworkFunctions"

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
  property: { type: DataType.String, name: '', defaultValue: '' }
}

export const InputContext = createContext(InputContextDefault)
