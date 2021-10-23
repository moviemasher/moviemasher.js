import React from 'react'
import { render } from 'react-dom'
import { MovieMasher, UnknownObject } from "@moviemasher/moviemasher.js"

import {
  MMApp,
  MMBrowser,
  MMTimeline,
  PlayToggle,
  Preview,
  Scrub,
  ScrubButton,
  TimelineClips,
  TimelineSizer,
  TimelineTracks,
  TimeSlider,
  ZoomSlider,
  MMBrowserView,
  MMBrowserSource,
} from '@moviemasher/react-moviemasher'

import '../../css/moviemasher-colors.css'
import '../../css/moviemasher-dimensions.css'
import '../../css/index.css'
import '../../css/moviemasher-layout.css'

import Slider from '@material-ui/core/Slider'
// import { Slider } from './Controls/Slider'

// const DetailsIcon = require('./svg/scrub.svg')

// import { Button } from './Controls/Button'
// import Button from '@material-ui/core/Button'
//import IconButton from '@material-ui/core/IconButton'
import PlayIcon from '@material-ui/icons/PlayCircleFilled'
import PauseIcon from '@material-ui/icons/PauseCircleFilled'
import DetailsIcon from '@material-ui/icons/Details'
import VolumeIcon from '@material-ui/icons/VolumeUp'
// import Add from '@material-ui/icons/Add'

// import MuteIcon from '@material-ui/icons/VolumeMute'
// import ScrubIcon from '@material-ui/icons/ArrowDropDown'
// import SaveIcon from '@material-ui/icons/Adjust'
// import UndoIcon from '@material-ui/icons/Undo'
// import RedoIcon from '@material-ui/icons/Redo'
// import { createTheme, ThemeProvider } from '@material-ui/core/styles'

import PhotoSizeSelectLarge from '@material-ui/icons/PhotoSizeSelectLarge'
import Theaters from '@material-ui/icons/Theaters';
import MovieFilter from '@material-ui/icons/MovieFilter'
import LibraryMusic from '@material-ui/icons/LibraryMusic'

// define fonts available
MovieMasher.font.define({
  id: "com.moviemasher.font.default",
  label: "Lobster",
  source: "https://fonts.gstatic.com/s/lobster/v23/neILzCirqoswsqX9zoKmM4MwWJU.woff2",
})


const mediaMethod = (object: UnknownObject) => {

}

const application = <React.StrictMode>
  <MMApp>
    <div className='moviemasher-panel moviemasher-player'>
      <Preview className="moviemasher-canvas" />
      <div className='moviemasher-controls moviemasher-foot'>
        <PlayToggle className='moviemasher-paused moviemasher-button'>
          <PlayIcon id='moviemasher-play-false' />
          <PauseIcon id='moviemasher-play-true' />
        </PlayToggle>
        <TimeSlider control={<Slider className='moviemasher-frame moviemasher-slider' />} />
      </div>
    </div>
    <MMBrowser className='moviemasher-panel moviemasher-browser'>
      <div className='moviemasher-head'>
        <MMBrowserSource>
          <PhotoSizeSelectLarge className='moviemasher-image' />
        </MMBrowserSource>
        <MMBrowserSource>
          <Theaters className='moviemasher-theme' />
        </MMBrowserSource>
        <MMBrowserSource>
          <MovieFilter className='moviemasher-video' />
        </MMBrowserSource>
        <MMBrowserSource>
          <LibraryMusic className='moviemasher-audio' />
        </MMBrowserSource>
      </div>
      <MMBrowserView className='moviemasher-content'>
        <div className='moviemasher-clip'>
          <label />
        </div>
      </MMBrowserView>

      <div className='moviemasher-foot'></div>
    </MMBrowser>
    <MMTimeline className='moviemasher-panel moviemasher-timeline'>
      <div className='moviemasher-controls moviemasher-head'>
        BUTTONS
      </div>

      <div className='moviemasher-content'>
        <div className='moviemasher-scrub-pad'/>
        <Scrub className='moviemasher-scrub'>
          <ScrubButton className='moviemasher-scrub-icon' >
            <DetailsIcon/>
          </ScrubButton>
        </Scrub>
        <div className='moviemasher-scrub-bar-container'>
          <ScrubButton className='moviemasher-scrub-bar' />
        </div>

        <TimelineTracks className='moviemasher-tracks'>
          <div className='moviemasher-track'>
            <div className='moviemasher-track-icon'>
              <VolumeIcon className='moviemasher-icon' />
            </div>
            <TimelineClips className='moviemasher-clips' label='--clip-label' selectClass='moviemasher-selected' dropClass='moviemasher-drop'>
              <div className='moviemasher-clip'>
                <label />
              </div>
            </TimelineClips>
          </div>
        </TimelineTracks>
        <TimelineSizer className='moviemasher-timeline-sizer' />
      </div>

      <div className='moviemasher-controls moviemasher-foot'>
        <ZoomSlider control={<Slider className='moviemasher-zoom moviemasher-slider' />} />
      </div>

    </MMTimeline>
  </MMApp>
</React.StrictMode>


const element = document.createElement("div")
document.body.appendChild(element)
element.setAttribute('class', 'moviemasher-app')
render(application, element)
