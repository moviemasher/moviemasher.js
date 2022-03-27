import React from 'react'
import { SelectionValue, PropertiedChangeHandler, Property } from "@moviemasher/moviemasher.js"

interface InputContextInterface {
  property?: Property
  value: SelectionValue
  changeHandler: PropertiedChangeHandler
}
const InputContextDefault: InputContextInterface = {
  value: '', changeHandler: () => {},
}

const InputContext = React.createContext(InputContextDefault)

export { InputContext, InputContextInterface, InputContextDefault }
