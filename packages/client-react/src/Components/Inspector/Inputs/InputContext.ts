import React from 'react'
import { 
  Scalar, PropertiedChangeHandler, Property, DataType, Time 
} from "@moviemasher/moviemasher.js"

export interface InputContextInterface {
  property: Property
  name: string
  value: Scalar
  defaultValue?: Scalar
  changeHandler?: PropertiedChangeHandler
  time?: Time
}

export const InputContextDefault: InputContextInterface = {
  value: '',
  name: '',
  property: { type: DataType.String, name: '', defaultValue: '' }
}

export const InputContext = React.createContext(InputContextDefault)
