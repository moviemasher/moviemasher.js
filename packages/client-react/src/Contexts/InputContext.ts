import React from 'react'
import { Scalar, PropertiedChangeHandler, Property, DataType } from "@moviemasher/moviemasher.js"

export interface InputContextInterface {
  property: Property
  value: Scalar
  changeHandler: PropertiedChangeHandler
}

export const InputContextDefault: InputContextInterface = {
  value: '',
  changeHandler: () => { },
  property: { type: DataType.String, name: '', defaultValue: '' }
}

export const InputContext = React.createContext(InputContextDefault)
