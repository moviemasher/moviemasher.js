import React from 'react'
import { WebrtcContext } from '../../Contexts/WebrtcContext'

const BroadcastingStatus: React.FunctionComponent = () => {
  const webrtContext = React.useContext(WebrtcContext)
  const { status } = webrtContext
  return <>{status}</>
}

export { BroadcastingStatus }
