import React from 'react'
import { UnknownObject } from '@moviemasher/moviemasher.js'
import { DefaultIcons } from '@moviemasher/icons-default'

import { Button } from '../Utilities'
import { ProcessActive } from '../Components/Process/ProcessActive'
import { ProcessInactive } from '../Components/Process/ProcessInactive'
import { Webrtc } from '../Components/Webrtc/Webrtc'
import { WebrtcButton } from '../Components/Webrtc/WebrtcButton'
import { WebrtcContent } from '../Components/Webrtc/WebrtcContent'


const application = <Webrtc className='panel webrtc'>
    <div className='head'>
      <WebrtcButton>
        <ProcessActive><Button>{DefaultIcons.playerPause}Stop Broadcasting</Button></ProcessActive>
        <ProcessInactive><Button>{DefaultIcons.playerPlay}Start Broadcasting</Button></ProcessInactive>
      </WebrtcButton>
    </div>
    <WebrtcContent className="content" />
    <div className='foot'>
    </div>
  </Webrtc>


export const DefaultStreamerProps = (args: UnknownObject) => {
  return { className: 'editor caster', children: application }
}
