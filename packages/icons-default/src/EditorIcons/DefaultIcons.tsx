import React from 'react'

import { RiMusic2Fill } from 'react-icons/ri'
import { MdInvertColors } from 'react-icons/md'
import { RiFilmFill } from 'react-icons/ri'
import { RiPlayCircleFill } from 'react-icons/ri'
import { RiPauseCircleFill } from 'react-icons/ri'
import { RiChatVoiceFill } from 'react-icons/ri'
import { RiVideoChatFill } from 'react-icons/ri'
import { IoColorFillSharp } from 'react-icons/io5'
import { RiImageFill } from 'react-icons/ri'
import { RiMvLine } from 'react-icons/ri'
import { RiMusicLine } from 'react-icons/ri'
import { RiVideoLine } from 'react-icons/ri'
import { RiArrowLeftRightLine } from 'react-icons/ri'
import { RiArrowRightSLine } from 'react-icons/ri'
import { RiUploadCloud2Line } from 'react-icons/ri'
import { RiArrowGoBackLine } from 'react-icons/ri'
import { RiArrowGoForwardLine } from 'react-icons/ri'
import { RiDeleteBin7Line } from 'react-icons/ri'
import { RiAddLine } from 'react-icons/ri'
import { RiEyeLine } from 'react-icons/ri'
import { RiEyeOffLine } from 'react-icons/ri'
import { BsReverseLayoutSidebarInsetReverse } from 'react-icons/bs'
import { RiVolumeUpLine } from 'react-icons/ri'
import { RiVolumeMuteLine } from 'react-icons/ri'
import { FaUserCircle } from 'react-icons/fa'
import { RiBroadcastFill } from 'react-icons/ri'
import { RiUserSettingsFill } from 'react-icons/ri'
import { RiStackFill } from 'react-icons/ri'
import { RiStackLine } from 'react-icons/ri'
import { RiChat3Fill } from 'react-icons/ri'
import { RiMessage3Fill } from 'react-icons/ri'
import { RiEdit2Fill } from 'react-icons/ri'
import { RiFolderLine } from 'react-icons/ri'
import { RiFolderOpenLine } from 'react-icons/ri'
import { RiFolderAddFill } from 'react-icons/ri'
import { MdPermMedia } from 'react-icons/md'
import { AiOutlineFieldTime } from 'react-icons/ai'
import { BiShapeTriangle } from 'react-icons/bi'
import { MdOutlineTextFields } from 'react-icons/md'
import { EditorIcons } from '@moviemasher/client-react'
import { MMTubeIcon } from '../Icons/MMTubeIcon'
import { MMIcon } from '../Icons/MMIcon'

import { VscTriangleRight } from 'react-icons/vsc'
import { VscTriangleDown } from 'react-icons/vsc'


export const DefaultIcons: EditorIcons = {
  collapse: <VscTriangleDown/>,
  collapsed: <VscTriangleRight/>,
  app: <img key='logo' src="mm.svg" />,
  add: <RiAddLine key='add' />,
  administrator: <RiUserSettingsFill key='administrator' />,
  audible: <RiVolumeUpLine key='audible' />,
  broadcast: <RiBroadcastFill key='broadcast' />,
  browser: <MdPermMedia key='browser' />,
  browserAudio: <RiMusic2Fill />,
  browserAudioStream: <RiChatVoiceFill />,
  browserEffect: <MdInvertColors />,
  browserShape: <BiShapeTriangle />,
  browserImage: <RiImageFill />,
  browserText: <MdOutlineTextFields />,
  browserFill: <IoColorFillSharp />,
  browserVideo: <RiFilmFill />,
  browserVideoStream: <RiVideoChatFill />,
  folder: <RiFolderLine key='folder' />,
  folderOpen: <RiFolderOpenLine key='folderOpen' />,
  folderAdd: <RiFolderAddFill key='folderAdd' />,
  chat: <RiChat3Fill key='chat' />,
  inaudible: <RiVolumeMuteLine key='inaudible' />,
  inspector: <RiEdit2Fill key='inspector' />,
  invisible: <RiEyeOffLine key='invisible' />,
  layer: <RiStackLine key='layer' />,
  layers: <RiStackFill key='layers' />,
  mm: <MMIcon />,
  message: <RiMessage3Fill key='message' />,
  playerPause: <RiPauseCircleFill key="player-pause" />,
  playerPlay: <RiPlayCircleFill key="player-play"/>,
  redo: <RiArrowGoForwardLine />,
  remove: <RiDeleteBin7Line />,
  streamers: <FaUserCircle key='streamers' />,
  matte: <BsReverseLayoutSidebarInsetReverse/>,
  timeline: <AiOutlineFieldTime key='timeline' />,
  timelineAddAudio: <RiMvLine />,
  timelineAddVideo: <RiVideoLine />,
  audio: <RiMusicLine />,
  transition: <RiArrowLeftRightLine />,
  video: <RiArrowRightSLine />,
  mmTube: <MMTubeIcon />,
  undo: <RiArrowGoBackLine />,
  upload: <RiUploadCloud2Line />,
  visible: <RiEyeLine key='visible' />,

}
