import React, { StrictMode } from 'react'
import { render } from 'react-dom'
import {
  RemixIcons, WebrtcView, BroadcastButton, Broadcasting, NotBroadcasting, WebrtcContent,
  BroadcastingStatus, Hosts
} from "@moviemasher/react-moviemasher"


const application = (
  <Hosts>
    <WebrtcView>
      <BroadcastButton>
        <Broadcasting>{RemixIcons.playerPause}</Broadcasting>
        <NotBroadcasting>{RemixIcons.playerPlay}</NotBroadcasting>
      </BroadcastButton>
      <WebrtcContent/>
      <BroadcastingStatus/>
    </WebrtcView>
  </Hosts>)

render(<StrictMode>{application}</StrictMode>, document.getElementById('app'))
