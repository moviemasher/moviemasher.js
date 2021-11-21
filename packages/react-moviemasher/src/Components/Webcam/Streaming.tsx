import React from 'react'
import { WebcamContext } from './WebcamContext'

const Streaming: React.FunctionComponent = props => {
  const streamerContext = React.useContext(WebcamContext)
  if (!streamerContext.streaming) return null

  return <>{props.children}</>
}

export { Streaming }
