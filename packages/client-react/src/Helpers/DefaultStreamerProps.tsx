import React from 'react'
import { UnknownObject } from '@moviemasher/moviemasher.js'
import { DefaultIcons } from '@moviemasher/icons-default'

import { Button } from '../Utilities'
import { Process } from '../Components/Process/Process'
import { ProcessActive } from '../Components/Process/ProcessActive'
import { ProcessInactive } from '../Components/Process/ProcessInactive'
import { ProcessStatus } from '../Components/Process/ProcessStatus'
import { Webrtc } from '../Components/Webrtc/Webrtc'
import { WebrtcButton } from '../Components/Webrtc/WebrtcButton'
import { WebrtcContent } from '../Components/Webrtc/WebrtcContent'


const application = <>
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

export const DefaultStreamerProps = (args: UnknownObject) => {
  return { className: 'editor caster', children: application }
}
