import React from 'react'
import { BooleanSetter, NumberSetter, StringSetter } from '@moviemasher/moviemasher.js'

interface ProcessContextInterface {
  error: string
  processing: boolean
  progress: number
  setError: StringSetter
  setProcessing: BooleanSetter
  setProgress: NumberSetter
  setStatus: StringSetter
  status: string
}

const ProcessContextDefault: ProcessContextInterface = {
  error: '',
  processing: false,
  progress: 0,
  setError: () => {},
  setProcessing: () => {},
  setProgress: () => {},
  setStatus: () => {},
  status: '',
}

const ProcessContext = React.createContext(ProcessContextDefault)

export { ProcessContext, ProcessContextInterface }
