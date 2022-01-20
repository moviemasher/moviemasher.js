import React from 'react'
import { WebrtcContext } from '../../Contexts/WebrtcContext'
import { PropsWithChildren, ReactResult } from '../../declarations'

function Broadcasting(props:PropsWithChildren): ReactResult {
  const webrtcContext = React.useContext(WebrtcContext)
  if (!webrtcContext.broadcasting) return null

  return <>{props.children}</>
}

export { Broadcasting }
