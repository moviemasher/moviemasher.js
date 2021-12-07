import React from 'react'
import { RemoteContext } from '../../Contexts/RemoteContext'

const NotProcessing: React.FunctionComponent = props => {
  const renderContext = React.useContext(RemoteContext)
  if (renderContext.processing) return null

  return <>{props.children}</>
}

export { NotProcessing }
