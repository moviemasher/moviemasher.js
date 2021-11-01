import React from 'react'

import PlayIcon from '@material-ui/icons/PlayCircleFilled'
import PauseIcon from '@material-ui/icons/PauseCircleFilled'
import PhotoSizeSelectLarge from '@material-ui/icons/PhotoSizeSelectLarge'
import Theaters from '@material-ui/icons/Theaters';
import MovieFilter from '@material-ui/icons/MovieFilter'
import LibraryMusic from '@material-ui/icons/LibraryMusic'
import VolumeIcon from '@material-ui/icons/VolumeUp'

import { EditorIcons } from '../../../declarations'

const MaterialIcons : EditorIcons = {
  browserAudio: <LibraryMusic />,
  browserEffect: <Theaters />,
  browserImage: <PhotoSizeSelectLarge />,
  browserTheme: <PhotoSizeSelectLarge />,
  browserVideo: <MovieFilter />,
  playerPause: <PauseIcon />,
  playerPlay: <PlayIcon />,
  timelineAudio: <VolumeIcon />,
}

export { MaterialIcons }
