import React from 'react'

import FolderTransferFillIcon from 'remixicon-react/FolderTransferFillIcon'
import Music2FillIcon from 'remixicon-react/Music2FillIcon'
import FolderSettingsFillIcon from 'remixicon-react/FolderSettingsFillIcon'
import FilmFillIcon from 'remixicon-react/FilmFillIcon'
import PlayCircleFillIcon from 'remixicon-react/PlayCircleFillIcon'
import PauseCircleFillIcon from 'remixicon-react/PauseCircleFillIcon'
import ArrowDownSFillIcon from 'remixicon-react/ArrowDownSFillIcon'
import FolderChartFillIcon from 'remixicon-react/FolderChartFillIcon'
import ImageFillIcon from 'remixicon-react/ImageFillIcon'
import MvFillIcon from 'remixicon-react/MvFillIcon'

import { EditorIcons } from '../../../declarations'

const RemixIcons : EditorIcons = {
  browserAudio: <Music2FillIcon />,
  browserEffect: <FolderSettingsFillIcon />,
  browserImage: <ImageFillIcon />,
  browserTheme: <FolderChartFillIcon />,
  browserTransition: <FolderTransferFillIcon />,
  browserVideo: <FilmFillIcon />,
  playerPause: <PauseCircleFillIcon />,
  playerPlay: <PlayCircleFillIcon />,
  timelineAudio: <MvFillIcon />,
}

export { RemixIcons }
