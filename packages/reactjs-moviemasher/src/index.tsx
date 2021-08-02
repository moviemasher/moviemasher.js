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
import UndoIcon from '@material-ui/icons/Undo'
import RedoIcon from '@material-ui/icons/Redo'

import { createTheme, ThemeProvider } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'

import Slider from '@material-ui/core/Slider'
import IconButton from '@material-ui/core/IconButton'


import { Slider as MovieMasherSlider } from './Controls/Slider'
import { Button as MovieMasherButton } from './Controls/Button'

import './css/moviemasher-colors.css'
import './css/moviemasher-dimensions.css'
import './index.css'
import './css/moviemasher-layout.css'


import { View } from './View'
import { Preview } from './Components/Preview'
import { PlayButton } from './Components/PlayButton'
import { App } from './App'
import { TimeSlider } from './Components/TimeSlider'
import { Timeline } from './Components/Timeline'
import { ZoomSlider } from './Components/ZoomSlider'

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
      <View className='moviemasher-controls'>
        <PlayButton play={<PlayIcon />} control={<MovieMasherButton />} pause={<PauseIcon />} className='moviemasher-paused moviemasher-button' />
        <TimeSlider control={<MovieMasherSlider className='moviemasher-frame moviemasher-slider' />} />
      </View>
    </View>
    <View className='moviemasher-panel moviemasher-timeline'>
      <View className='moviemasher-controls'>

      </View>
      <View className='moviemasher-controls-scrub'>

      </View>

      <Timeline className='moviemasher-content' >
        <View className='moviemasher-clip' label='--clip-label'>
          <label />
        </View>
      </Timeline>
      <View className='moviemasher-footer'>
        <ZoomSlider control={<MovieMasherSlider className='moviemasher-zoom moviemasher-slider' />} />
      </View>
    </View>
  </App>
</StrictMode>
ReactDOM.render(application, element)
// track={<View className='moviemasher-track' />}
