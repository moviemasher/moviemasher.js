import React from 'react'
import { RemoteContext } from '../../Contexts/RemoteContext'

const Status: React.FunctionComponent = () => {
  const remoteContext = React.useContext(RemoteContext)
  const { status } = remoteContext
  return <>{status}</>
}

export { Status }
