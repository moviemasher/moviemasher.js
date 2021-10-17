import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { MovieMasher } from "@moviemasher/moviemasher.js"

import PlayIcon from '@material-ui/icons/PlayCircleFilled';
import PauseIcon from '@material-ui/icons/PauseCircleFilled';
// import Add from '@material-ui/icons/Add';
import PhotoSizeSelectLarge from '@material-ui/icons/PhotoSizeSelectLarge';
import Theaters from '@material-ui/icons/Theaters';
import MovieFilter from '@material-ui/icons/MovieFilter'
import LibraryMusic from '@material-ui/icons/LibraryMusic'
import VolumeIcon from '@material-ui/icons/VolumeUp'
import MuteIcon from '@material-ui/icons/VolumeMute'
import ScrubIcon from '@material-ui/icons/ArrowDropDown'
import SaveIcon from '@material-ui/icons/Adjust'
// const DetailsIcon = require('./svg/scrub.svg')
import DetailsIcon from '@material-ui/icons/Details'
import UndoIcon from '@material-ui/icons/Undo'
import RedoIcon from '@material-ui/icons/Redo'

import { createTheme, ThemeProvider } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'

import Slider from '@material-ui/core/Slider'
import IconButton from '@material-ui/core/IconButton'


import { Slider as MovieMasherSlider } from './Controls/Slider'
// import { Button as MovieMasherButton } from './Controls/Button'

import './css/moviemasher-colors.css'
import './css/moviemasher-dimensions.css'
import './index.css'
import './css/moviemasher-layout.css'


import { View } from './View'
import { Preview } from './Components/Preview'
import { App } from './App'
import { TimeSlider } from './Components/TimeSlider'
import { Timeline } from './Components/Timeline'
import { ZoomSlider } from './Components/Timeline/ZoomSlider'
// import { Scrubber } from './Components/Timeline/Scrub'
import { PlayToggle } from './Components/PlayToggle'

// define fonts available
MovieMasher.font.define({
  id: "com.moviemasher.font.default",
  label: "Lobster",
  source: "https://fonts.gstatic.com/s/lobster/v23/neILzCirqoswsqX9zoKmM4MwWJU.woff2",
})

// const options: AppStaticObject = {

//   api: "http://localhost:8080/api/",
//   player: {
//     paused: { play: , pause: , control : <MovieMasherButton /> },
//     volume: { volume: <VolumeIcon />, mute: <MuteIcon />,  },
//     frame: { control: <Slider /> },
//   },
//   browser: {
//     selected: DefinitionType.Theme,
//     type: {
//       [DefinitionType.Audio]: <IconButton children={<LibraryMusic/>} />,
//       [DefinitionType.Image]: <MovieMasherButton children={<PhotoSizeSelectLarge />} />,
//       [DefinitionType.Theme]: <IconButton children={<MovieFilter />} />,
//       [DefinitionType.Video]: <IconButton children={<Theaters />} />,
//     }
//   },
//   inspector: {

//   },
//   timeline: {
//     scrub: <ScrubIcon />,
//     undo: { undo: <Button startIcon={<UndoIcon />} children='undo' /> },
//     redo: { redo: <MovieMasherButton endIcon={<RedoIcon />} children='redo' /> },
//     zoom: { zoom: <Slider /> }
//   }
// }

const element = document.createElement("div")
document.body.appendChild(element)
element.setAttribute('class', 'moviemasher-app')

const application = <StrictMode>
  <App>
    <View className='moviemasher-panel moviemasher-player'>
      <Preview className="moviemasher-canvas" />
      <View className='moviemasher-controls moviemasher-foot'>
        <PlayToggle className='moviemasher-paused moviemasher-button'>
          <PlayIcon id='moviemasher-play-false' />
          <PauseIcon id='moviemasher-play-true' />
        </PlayToggle>
        <TimeSlider control={<MovieMasherSlider className='moviemasher-frame moviemasher-slider' />} />
      </View>
    </View>
    <Timeline className='moviemasher-panel moviemasher-timeline'>
      <View className='moviemasher-controls moviemasher-head'>
        BUTTONS
      </View>

      <View className='moviemasher-content'>
        <View className='moviemasher-scrub-pad'/>
        <Timeline.Scrub className='moviemasher-scrub'>
          <Timeline.Scrub.Button className='moviemasher-scrub-icon' >
            <DetailsIcon/>
          </Timeline.Scrub.Button>
        </Timeline.Scrub>
        <View className='moviemasher-scrub-bar-container'>
          <Timeline.Scrub.Button className='moviemasher-scrub-bar' />
        </View>

        <Timeline.Tracks className='moviemasher-tracks'>
          <View className='moviemasher-track'>
            <View className='moviemasher-track-icon'>
              <VolumeIcon className='moviemasher-icon' />
            </View>
            <Timeline.Clips className='moviemasher-clips'>
              <View className='moviemasher-clip' label='--clip-label'>
                <label />
              </View>
            </Timeline.Clips>
          </View>
        </Timeline.Tracks>
        <Timeline.Sizer className='moviemasher-timeline-sizer' />
      </View>

      <View className='moviemasher-controls moviemasher-foot'>
        <Timeline.Zoom control={<MovieMasherSlider className='moviemasher-zoom moviemasher-slider' />} />
      </View>

    </Timeline>
  </App>
</StrictMode>


//       <View className='moviemasher-content'>

//         <View id='moviemasher-track' className='moviemasher-track'>
//           <VolumeIcon className='moviemasher-icon' />

//         </View>
//         <View id='moviemasher-clip' className='moviemasher-clip' label='--clip-label'>
//           <label />
//         </View>
//       </View>
      // const dragHandler = (event: React.DragEvent) => {
//   console.log("dragHandler")
// event.dataTransfer.setData('text/plain', 'Fuck yeah')

// }
// const pProps = {
//   children: 'HEY!',
//   draggable: true,
//   onDragStart: dragHandler,
// }
// const wtf = <p/>
// const clone = React.cloneElement(wtf, pProps)
ReactDOM.render(application, element)
