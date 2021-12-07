import React from "react"

import { RemoteContext } from "../../Contexts/RemoteContext"
import { HostsContext } from "../../Contexts/HostsContext"

interface HostProps {
  id: string
}
const Host: React.FunctionComponent<HostProps> = props => {
  const hostsContext = React.useContext(HostsContext)
  const [processing, setProcessing] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [status, setStatus] = React.useState('')
  const [error, setError] = React.useState('')

  const { children, id } = props
  const { enabled } = hostsContext
  if (!enabled.includes(id)) return null

  const renderContext = {
    processing, setProcessing,
    status, setStatus,
    progress, setProgress,
    error, setError,
  }

  return (
    <RemoteContext.Provider value={renderContext}>
      {children}
    </RemoteContext.Provider>
  )
}

export { Host }
