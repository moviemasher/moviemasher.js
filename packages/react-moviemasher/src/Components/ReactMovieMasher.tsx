import React from 'react'

import { DataType } from '@moviemasher/moviemasher.js'
import { Editor } from './Editor/Editor'
import { Preview } from './Player/Preview'
import { PlayButton } from './Player/PlayButton'
import { TimeSlider } from './Player/TimeSlider'
import { Browser } from './Browser/Browser'
import { BrowserContent } from './Browser/BrowserContent'
import { BrowserSource } from './Browser/BrowserSource'
import { MMTimeline } from './Timeline/MMTimeline'
import { ScrubButton } from './Timeline/ScrubButton'
import { TimelineClips } from './Timeline/TimelineClips'
import { TimelineSizer } from './Timeline/TimelineSizer'
import { ZoomSlider } from './Timeline/ZoomSlider'
import { TimelineTracks } from './Timeline/TimelineTracks'
import { Scrub } from './Timeline/Scrub'
import { PlayerPanel } from './Player/PlayerPanel'
import { Playing } from './Player/Playing'
import { Paused } from './Player/Paused'
import { EditorIcons, EditorInputs } from '../declarations'
import { InspectorPanel } from './Inspector/InspectorPanel'
import { Defined } from './Inspector/Defined'
import { Inspector } from './Inspector/Inspector'
import { TypeNotSelected } from './Inspector/TypeNotSelected'
import { Informer } from './Inspector/Informer'

interface ReactMovieMasherProps {
  icons: EditorIcons
  inputs: EditorInputs
}

const ReactMovieMasher: React.FunctionComponent<ReactMovieMasherProps> = props => {
  const { icons, inputs } = props

  return (
    <Editor className='moviemasher-app'>
      <PlayerPanel className='moviemasher-panel moviemasher-player'>
        <Preview className="moviemasher-canvas" />
        <div className='moviemasher-controls moviemasher-foot'>
          <PlayButton className='moviemasher-paused moviemasher-button'>
            <Playing>{icons.playerPause}</Playing>
            <Paused>{icons.playerPlay}</Paused>
          </PlayButton>
          <TimeSlider />
        </div>
      </PlayerPanel>
      <Browser className='moviemasher-panel moviemasher-browser'>
        <div className='moviemasher-head'>
          <BrowserSource id='video' className='moviemasher-button-icon' children={icons.browserVideo}/>
          <BrowserSource id='audio' className='moviemasher-button-icon' children={icons.browserAudio}/>
          <BrowserSource id='image' className='moviemasher-button-icon' children={icons.browserImage}/>
          <BrowserSource id='theme' className='moviemasher-button-icon' children={icons.browserTheme}/>
          <BrowserSource id='effect' className='moviemasher-button-icon' children={icons.browserEffect}/>
          <BrowserSource id='transition' className='moviemasher-button-icon' children={icons.browserTransition}/>
        </div>
        <BrowserContent
          selectClass='moviemasher-selected'
          label='--clip-label'
          className='moviemasher-content'
        >
          <div className='moviemasher-definition'>
            <label />
          </div>
        </BrowserContent>
        <div className='moviemasher-foot'></div>
      </Browser>

      <MMTimeline className='moviemasher-panel moviemasher-timeline'>
        <div className='moviemasher-controls moviemasher-head'>
          BUTTONS
        </div>
        <div className='moviemasher-content'>
          <div className='moviemasher-scrub-pad' />
          <Scrub className='moviemasher-scrub'>
            <ScrubButton className='moviemasher-scrub-icon'/>
          </Scrub>
          <div className='moviemasher-scrub-bar-container'>
            <ScrubButton className='moviemasher-scrub-bar' />
          </div>
          <TimelineTracks className='moviemasher-tracks'>
            <div className='moviemasher-track'>
              <div className='moviemasher-track-icon' children={icons.timelineAudio} />
              <TimelineClips
                className='moviemasher-clips'
                dropClass='moviemasher-drop'
                selectClass='moviemasher-selected'
                label='--clip-label'
              >
                <div className='moviemasher-clip'>
                  <label />
                </div>
              </TimelineClips>
            </div>
          </TimelineTracks>
          <TimelineSizer className='moviemasher-timeline-sizer' />
        </div>
        <div className='moviemasher-controls moviemasher-foot'>
          <ZoomSlider/>
        </div>
      </MMTimeline>
      <InspectorPanel className='moviemasher-panel moviemasher-inspector'>
        <div className='moviemasher-content'>
          <Inspector properties='label,backcolor' inputs={inputs}><label/></Inspector>

          <TypeNotSelected type='mash'>
            <Defined property='color' className='moviemasher-input'>
              <label>Color</label> {inputs[DataType.Text]}
            </Defined>
            <Inspector inputs={inputs} className='moviemasher-input'><label/></Inspector>

          </TypeNotSelected>
          <Informer><label/></Informer>
        </div>
        <div className='moviemasher-foot'/>
      </InspectorPanel>
    </Editor>
  )
}
export { ReactMovieMasher }
