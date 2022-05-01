import React from 'react'


import { UnknownObject } from '@moviemasher/moviemasher.js'
import { Button } from '../Utilities'
import { CasterLayers } from '../Components/CasterLayers/CasterLayers'
import { PlayerContent } from '../Components/Player/PlayerContent'
import { Process } from '../Components/Process/Process'
import { Streamer } from '../Components/Streamer/Streamer'
import { DefaultIcons } from '../Components/Editor/EditorIcons/DefaultIcons'
import { ProcessActive } from '../Components/Process/ProcessActive'
import { StreamerControl } from '../Components/Streamer/StreamerControl'
import { StreamerPreloadControl } from '../Components/Streamer/StreamerPreloadControl'
import { ProcessInactive } from '../Components/Process/ProcessInactive'
import { StreamerUpdateControl } from '../Components/Streamer/StreamerUpdateControl'
import { ProcessStatus } from '../Components/Process/ProcessStatus'
import { Webrtc } from '../Components/Webrtc/Webrtc'
import { StreamerContent } from '../Components/Streamer/StreamerContent'
import { WebrtcButton } from '../Components/Webrtc/WebrtcButton'
import { WebrtcContent } from '../Components/Webrtc/WebrtcContent'


const application = <>
    <CasterLayers className="panel layers">
      <div className='head'><img key='logo' src="mm.svg" /></div>
      <div className='content'></div>
      <div className='foot'></div>
    </CasterLayers>
    <div className="panel switcher">
      <div className='head'></div>
      <PlayerContent className="content" />
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
            <ProcessActive>
              <Button startIcon={DefaultIcons.playerPause}>Stop Streaming</Button>
            </ProcessActive>
            <ProcessInactive>
              <Button startIcon={DefaultIcons.playerPlay}>Start Streaming</Button>
            </ProcessInactive>
          </StreamerControl>
          <StreamerPreloadControl>
            <Button>Preload</Button>
          </StreamerPreloadControl>
          <StreamerUpdateControl>
            <Button>Update</Button>
          </StreamerUpdateControl>
        </div>
        <StreamerContent className="content" />
        <div className='foot'>
          <ProcessStatus />
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
        <WebrtcContent className="content" />
        <div className='foot'>
          <ProcessStatus />
        </div>
      </Webrtc>
    </Process>
</>

export const DefaultCasterProps = (args: UnknownObject) => {
  return { className: 'editor caster', children: application }
}
