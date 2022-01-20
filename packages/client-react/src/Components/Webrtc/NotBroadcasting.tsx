import React from 'react'
import { WebrtcContext } from '../../Contexts/WebrtcContext'
import { PropsWithChildren, ReactResult } from '../../declarations'


function NotBroadcasting(props: PropsWithChildren): ReactResult {
  const webrtcContext = React.useContext(WebrtcContext)
  if (webrtcContext.broadcasting) return null

  return <>{props.children}</>
}

export { NotBroadcasting }
