import React from 'react'
import { SelectionValue, PropertiedChangeHandler } from "@moviemasher/moviemasher.js"

interface InputContextInterface {
  property: string
  value: SelectionValue
  changeHandler: PropertiedChangeHandler
}
const InputContextDefault: InputContextInterface = {
  property: '', value: '', changeHandler: () => {},
}

const InputContext = React.createContext(InputContextDefault)

export { InputContext, InputContextInterface, InputContextDefault }
