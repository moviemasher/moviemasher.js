import React from 'react'
import { WebrtcContext } from '../../Contexts/WebrtcContext'

const NotBroadcasting: React.FunctionComponent = props => {
  const webrtcContext = React.useContext(WebrtcContext)
  if (webrtcContext.broadcasting) return null

  return <>{props.children}</>
}

export { NotBroadcasting }
