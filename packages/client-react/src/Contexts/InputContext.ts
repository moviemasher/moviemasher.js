import React from 'react'
import { Scalar, PropertiedChangeHandler, Property } from "@moviemasher/moviemasher.js"

interface InputContextInterface {
  property?: Property
  value: Scalar
  changeHandler: PropertiedChangeHandler
}
const InputContextDefault: InputContextInterface = {
  value: '', changeHandler: () => {},
}

const InputContext = React.createContext(InputContextDefault)

export { InputContext, InputContextInterface, InputContextDefault }
