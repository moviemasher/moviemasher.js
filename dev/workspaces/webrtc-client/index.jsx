import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import {
  DefaultIcons, WebrtcView, WebrtcButton, ProcessActive, ProcessInactive, WebrtcContent,
  ProcessStatus, Api
} from "@moviemasher/client-react"


const application = <Api>
  <WebrtcView>
    <WebrtcButton>
      <ProcessActive>{DefaultIcons.playerPause}</ProcessActive>
      <ProcessInactive>{DefaultIcons.playerPlay}</ProcessInactive>
    </WebrtcButton>
    <WebrtcContent/>
    <ProcessStatus/>
  </WebrtcView>
</Api>

ReactDOM.render(<StrictMode>{application}</StrictMode>, document.getElementById('app'))
