import React from 'react'
import { Scalar, PropertiedChangeHandler, Property } from "@moviemasher/moviemasher.js"

export interface InputContextInterface {
  property?: Property
  value: Scalar
  changeHandler: PropertiedChangeHandler
}

export const InputContextDefault: InputContextInterface = {
  value: '', changeHandler: () => {},
}

export const InputContext = React.createContext(InputContextDefault)
