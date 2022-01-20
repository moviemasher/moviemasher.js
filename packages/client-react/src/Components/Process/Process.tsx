import React from "react"
import { ServerType } from "@moviemasher/moviemasher.js"

import { ProcessContext } from "../../Contexts/ProcessContext"
import { ApiContext } from "../../Contexts/ApiContext"
import { PropsWithChildren, ReactResult } from "../../declarations"
import { ServerTypes } from "@moviemasher/moviemasher.js"

interface ProcessProps extends PropsWithChildren {
  id: ServerType | string
}

function Process(props:ProcessProps): ReactResult {
  const apiContext = React.useContext(ApiContext)
  const [processing, setProcessing] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [status, setStatus] = React.useState('')
  const [error, setError] = React.useState('')

  const { children, id } = props
  const { enabled } = apiContext
  if (!ServerTypes.map(String).includes(id)) return null
  const serverType = id as ServerType
  if (!enabled.includes(serverType)) return null

  const processContext = {
    processing, setProcessing,
    status, setStatus,
    progress, setProgress,
    error, setError,
  }

  return (
    <ProcessContext.Provider value={processContext}>
      {children}
    </ProcessContext.Provider>
  )
}

export { Process, ProcessProps }
