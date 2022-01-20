import React from 'react'
import { WebrtcContext } from '../../Contexts/WebrtcContext'
import { PropsWithoutChild, ReactResult } from '../../declarations'

function BroadcastingStatus(_:PropsWithoutChild): ReactResult {
  const webrtContext = React.useContext(WebrtcContext)
  const { status } = webrtContext
  return <>{status}</>
}

export { BroadcastingStatus }
