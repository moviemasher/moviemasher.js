import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import {
  Caster, DefaultIcons, ApiClient, Process, ProcessStatus, ProcessActive,
  StreamerControl, Button, Webrtc, WebrtcContent, WebrtcButton, ProcessInactive,
  PlayerContent, StreamerContent, Streamer, StreamerPreloadControl,
  StreamerUpdateControl, Layers,
} from "@moviemasher/client-react"

import "@moviemasher/client-react/dist/moviemasher.css"

const application = <ApiClient>
  <Caster className="editor caster">
    <Layers className="panel layers">
      <div className='head'></div>
      <div className='content'></div>
      <div className='foot'></div>
    </Layers>
    <div className="panel switcher">
      <div className='head'></div>
      <PlayerContent className="content"/>
      <div className='foot'></div>
    </div>
    <div className="panel layouts">
      <div className='head'></div>
      <div className='content'></div>
      <div className='foot'></div>
    </div>
    <Process key="stream-process" id='streaming'>
      <Streamer className='panel viewer'>
        <div className='head'>
          <StreamerControl>
            <ProcessActive><Button startIcon={DefaultIcons.playerPause}>Stop Streaming</Button></ProcessActive>
            <ProcessInactive><Button startIcon={DefaultIcons.playerPlay}>Start Streaming</Button></ProcessInactive>
          </StreamerControl>
          <StreamerPreloadControl>
            <Button>Preload</Button>
          </StreamerPreloadControl>
          <StreamerUpdateControl>
            <Button>Update</Button>
          </StreamerUpdateControl>
        </div>
        <StreamerContent className="content"/>
        <div className='foot'>
          <ProcessStatus/>
        </div>
      </Streamer>
    </Process>
    <Process key="webrtc-process" id='streaming'>
      <Webrtc className='panel webrtc'>
        <div className='head'>
          <WebrtcButton>
            <ProcessActive><Button startIcon={DefaultIcons.playerPause}>Stop Broadcasting</Button></ProcessActive>
            <ProcessInactive><Button startIcon={DefaultIcons.playerPlay}>Start Broadcasting</Button></ProcessInactive>
          </WebrtcButton>
        </div>
        <WebrtcContent className="content"/>
        <div className='foot'>
          <ProcessStatus/>
        </div>
      </Webrtc>
    </Process>
  </Caster>
</ApiClient>

const mode = <StrictMode>{application}</StrictMode>
ReactDOM.render(mode, document.getElementById('app'))
