import React from 'react'

import FolderTransferFillIcon from 'remixicon-react/FolderTransferFillIcon'
import Music2FillIcon from 'remixicon-react/Music2FillIcon'
import FolderSettingsFillIcon from 'remixicon-react/FolderSettingsFillIcon'
import FilmFillIcon from 'remixicon-react/FilmFillIcon'
import PlayCircleFillIcon from 'remixicon-react/PlayCircleFillIcon'
import PauseCircleFillIcon from 'remixicon-react/PauseCircleFillIcon'
import ChatVoiceFillIcon from 'remixicon-react/ChatVoiceFillIcon'
import VideoChatFillIcon from 'remixicon-react/VideoChatFillIcon'
import FolderChartFillIcon from 'remixicon-react/FolderChartFillIcon'
import ImageFillIcon from 'remixicon-react/ImageFillIcon'
import MvLineIcon from 'remixicon-react/MvLineIcon'
import MusicLineIcon from 'remixicon-react/MusicLineIcon'
import VideoLineIcon from 'remixicon-react/VideoLineIcon'
import SwapBoxLineIcon from 'remixicon-react/SwapBoxLineIcon'
import ArrowLeftRightLineIcon from 'remixicon-react/ArrowLeftRightLineIcon'
import ArrowRightSLineIcon from 'remixicon-react/ArrowRightSLineIcon'
import UploadCloud2LineIcon from 'remixicon-react/UploadCloud2LineIcon'
import ArrowGoBackLineIcon from 'remixicon-react/ArrowGoBackLineIcon'
import ArrowGoForwardLineIcon from 'remixicon-react/ArrowGoForwardLineIcon'
import DeleteBin7LineIcon from 'remixicon-react/DeleteBin7LineIcon'

import SplitCellsHorizontalIcon from 'remixicon-react/SplitCellsHorizontalIcon'
import { EditorIcons } from '../../../declarations'

const DefaultIcons: EditorIcons = {
  browserAudio: <Music2FillIcon />,
  browserEffect: <FolderSettingsFillIcon />,
  browserImage: <ImageFillIcon />,
  browserTheme: <FolderChartFillIcon />,
  browserTransition: <FolderTransferFillIcon />,
  browserVideo: <FilmFillIcon />,
  browserVideoStream: <VideoChatFillIcon />,
  browserAudioStream: <ChatVoiceFillIcon />,
  playerPause: <PauseCircleFillIcon />,
  playerPlay: <PlayCircleFillIcon />,
  timelineAddTransition: <SwapBoxLineIcon />,
  timelineAddAudio: <MvLineIcon />,
  timelineAddVideo: <VideoLineIcon />,
  timelineTrackTransition: <ArrowLeftRightLineIcon />,
  timelineTrackAudio: <MusicLineIcon />,
  timelineTrackVideo: <ArrowRightSLineIcon />,
  upload: <UploadCloud2LineIcon />,
  undo: <ArrowGoBackLineIcon />,
  redo: <ArrowGoForwardLineIcon />,
  remove: <DeleteBin7LineIcon />,
  split: <SplitCellsHorizontalIcon />,
}

export { DefaultIcons }
