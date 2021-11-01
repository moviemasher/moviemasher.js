import React from 'react'
import { SelectionValue, MasherChangeHandler } from "@moviemasher/moviemasher.js"

interface InputContextInterface {
  property: string
  value: SelectionValue
  changeHandler: MasherChangeHandler
  // actionNonce: string
}
const InputContextDefault: InputContextInterface = {
  property: '',
  value: '',
  // actionNonce: '',
  changeHandler: () => {},
}

const InputContext = React.createContext(InputContextDefault)

export { InputContext, InputContextInterface, InputContextDefault }
