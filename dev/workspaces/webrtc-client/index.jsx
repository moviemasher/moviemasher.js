import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import {
  RemixIcons, WebrtcView, BroadcastButton, Broadcasting, NotBroadcasting, WebrtcContent,
  BroadcastingStatus, Api
} from "@moviemasher/client-react"


const application = <Api>
  <WebrtcView>
    <BroadcastButton>
      <Broadcasting>{RemixIcons.playerPause}</Broadcasting>
      <NotBroadcasting>{RemixIcons.playerPlay}</NotBroadcasting>
    </BroadcastButton>
    <WebrtcContent/>
    <BroadcastingStatus/>
  </WebrtcView>
</Api>

ReactDOM.render(<StrictMode>{application}</StrictMode>, document.getElementById('app'))
