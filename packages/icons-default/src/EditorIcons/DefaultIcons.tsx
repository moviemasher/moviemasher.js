import React from 'react'

import { 
  RiMusic2Fill,
  RiFilmFill,
  RiPlayCircleFill,
  RiPauseCircleFill,
  RiChatVoiceFill,
  RiVideoChatFill,
  RiImageFill,
  RiMvLine,
  RiMusicLine,
  RiVideoLine,
  RiArrowLeftRightLine,
  RiArrowRightSLine,
  RiUploadCloud2Line,
  RiArrowGoBackLine,
  RiArrowGoForwardLine,
  RiDeleteBin7Line,
  RiAddLine,
  RiEyeLine,
  RiEyeOffLine,
  RiVolumeUpLine,
  RiVolumeMuteLine,
  RiBroadcastFill,
  RiUserSettingsFill,
  RiStackFill,
  RiStackLine,
  RiChat3Fill,
  RiMessage3Fill,
  RiEdit2Fill,
  RiFolderLine,
  RiFolderOpenLine,
  RiFolderAddFill,
} from 'react-icons/ri'

import { 
  MdInvertColors,
  MdPermMedia, 
  MdOutlineTextFields, 
  MdOutlineTimelapse,
  MdOpacity,
 } from 'react-icons/md'

import { 
  IoColorFillSharp, 
  IoDocument,
} from 'react-icons/io5'

import { 
  BsSkipStartFill, BsSkipEndFill,
  BsReverseLayoutSidebarInsetReverse, 
  BsSkipEnd,
 } from 'react-icons/bs'

import { 
  FaUserCircle,
  FaExpand,
  FaExclamationCircle,
  FaRegCheckCircle,
} from 'react-icons/fa'

// import { AiOutlineFieldTime } from 'react-icons/ai'
import { BiShapeTriangle, BiBorderOuter, BiBorderInner } from 'react-icons/bi'
import { GiDirectorChair } from 'react-icons/gi'

import { TbActivityHeartbeat } from 'react-icons/tb'
import { TiZoomOutOutline, TiZoomInOutline } from 'react-icons/ti'
import { 
  GiMove, GiResize, 
  GiHorizontalFlip, GiVerticalFlip,
 } from 'react-icons/gi'
import { HiArrowsExpand, HiEye, HiLockClosed, HiLockOpen } from 'react-icons/hi'
import { ImFileVideo, ImSpinner3 } from 'react-icons/im'

import { 
  VscTriangleRight, 
  VscTriangleDown,
 
} from 'react-icons/vsc'

import { MMTubeIcon } from '../Icons/MMTubeIcon'
import { MMWideIcon } from '../Icons/MMWideIcon'
import { MMIcon } from '../Icons/MMIcon'


export const DefaultIcons = {
  add: <RiAddLine key='add' />,

  activity: <TbActivityHeartbeat key='activity' />,
  active: <ImSpinner3 key='active' />,
  complete: <FaRegCheckCircle key='complete' />,
  error: <FaExclamationCircle key='error' />,
  


  administrator: <RiUserSettingsFill key='administrator' />,
  app: <img key='logo' src="mm.svg" />,
  audible: <RiVolumeUpLine key='audible' />,
  audio: <RiMusicLine />,
  broadcast: <RiBroadcastFill key='broadcast' />,
  composer: <GiDirectorChair key='composer' />,
  browser: <MdPermMedia key='browser' />,
  browserAudio: <RiMusic2Fill />,
  browserAudioStream: <RiChatVoiceFill />,
  browserEffect: <MdInvertColors />,
  browserImage: <RiImageFill />,
  browserShape: <BiShapeTriangle />,
  browserText: <MdOutlineTextFields />,
  browserVideo: <RiFilmFill />,
  browserVideoStream: <RiVideoChatFill />,
  chat: <RiChat3Fill key='chat' />,
  clip: <MdOutlineTimelapse/>,
  collapse: <VscTriangleDown/>,
  collapsed: <VscTriangleRight/>,
  color: <IoColorFillSharp key="color" />,
  container: <BiBorderOuter/>,
  content: <BiBorderInner/>,
  document: <IoDocument key="document" />,
  end: <BsSkipEndFill />,
  endUndefined: <BsSkipEnd />,
  folder: <RiFolderLine key='folder' />,
  folderAdd: <RiFolderAddFill key='folderAdd' />,
  folderOpen: <RiFolderOpenLine key='folderOpen' />,
  horz: <GiHorizontalFlip key="horz-flip" />,
  inaudible: <RiVolumeMuteLine key='inaudible' />,
  inspector: <RiEdit2Fill key='inspector' />,
  invisible: <RiEyeOffLine key='invisible' />,
  lock: <HiLockClosed />,
  matte: <BsReverseLayoutSidebarInsetReverse/>,
  message: <RiMessage3Fill key='message' />,
  mm: <MMIcon />,
  mmTube: <MMTubeIcon />,
  mmWide: <MMWideIcon />,
  opacity: <MdOpacity key="opacity" />,
  playerPause: <RiPauseCircleFill key="player-pause" />,
  playerPlay: <RiPlayCircleFill key="player-play"/>,
  point: <GiMove key="point" />,
  redo: <RiArrowGoForwardLine />,
  remove: <RiDeleteBin7Line key="remove" />,
  render: <ImFileVideo />,
  size: <GiResize key="size" />,
  start: <BsSkipStartFill />,
  streamers: <FaUserCircle key='streamers' />,
  timeline: <MdOutlineTimelapse key='timeline' />,
  timelineAddAudio: <RiMvLine />,
  timelineAddVideo: <RiVideoLine />,
  track: <RiStackLine/>,
  trackDense: <RiStackFill key="track-dense"/>,
  transition: <RiArrowLeftRightLine />,
  undo: <RiArrowGoBackLine />,
  unlock: <HiLockOpen />,
  upload: <RiUploadCloud2Line key="upload" />,
  vert: <GiVerticalFlip key="vert-flip" />,
  video: <RiArrowRightSLine />,
  view: <HiEye />,
  visible: <RiEyeLine key='visible' />,
  zoomLess: <TiZoomOutOutline key="zoom-less" />,
  zoomMore: <TiZoomInOutline key="zoom-more" />,
}
