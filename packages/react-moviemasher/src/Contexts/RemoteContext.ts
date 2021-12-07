import React from 'react'
import { BooleanSetter, NumberSetter, StringSetter } from '@moviemasher/moviemasher.js'

interface RemoteContextInterface {
  error: string
  processing: boolean
  progress: number
  setError: StringSetter
  setProcessing: BooleanSetter
  setProgress: NumberSetter
  setStatus: StringSetter
  status: string
}

const RemoteContextDefault: RemoteContextInterface = {
  error: '',
  processing: false,
  progress: 0,
  setError: () => {},
  setProcessing: () => {},
  setProgress: () => {},
  setStatus: () => {},
  status: '',
}

const RemoteContext = React.createContext(RemoteContextDefault)

export { RemoteContext }
