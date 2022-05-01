import React from 'react'
import { BooleanSetter, NumberSetter, StringSetter } from '@moviemasher/moviemasher.js'

export interface ProcessContextInterface {
  error: string
  processing: boolean
  progress: number
  setError: StringSetter
  setProcessing: BooleanSetter
  setProgress: NumberSetter
  setStatus: StringSetter
  status: string
}

export const ProcessContextDefault: ProcessContextInterface = {
  error: '',
  processing: false,
  progress: 0,
  setError: () => {},
  setProcessing: () => {},
  setProgress: () => {},
  setStatus: () => {},
  status: '',
}

export const ProcessContext = React.createContext(ProcessContextDefault)
