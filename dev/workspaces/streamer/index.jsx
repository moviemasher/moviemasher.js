import React, { StrictMode } from 'react'
import { render } from 'react-dom'
import {
  RemixIcons, WebcamPanel, StreamButton, Streaming, NotStreaming, WebcamContent
} from "@moviemasher/react-moviemasher"

const children = []
children.push(
  <StreamButton>
    <Streaming>{RemixIcons.playerPause}</Streaming>

    <NotStreaming>{RemixIcons.playerPlay}</NotStreaming>
  </StreamButton>
)
children.push(
  <WebcamContent/>
)

const applicationOptions = {
  children,
  remoteServer: {
    port: 8577
  }
}


const application = <WebcamPanel {...applicationOptions} />

render(<StrictMode>{application}</StrictMode>, document.getElementById('app'))
