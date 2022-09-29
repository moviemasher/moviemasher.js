import React from 'react'
import { 
  AiOutlineColumnWidth,
} from 'react-icons/ai'
import { 
  CgArrowLongRightL, CgCast, CgArrowLongLeftL
} from 'react-icons/cg'
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
  MdOpacity, MdLabel,
  MdOutlineSpeed,
} from 'react-icons/md'
import { 
  IoMdColorFill,
} from 'react-icons/io'
import { 
  IoDocument, 
} from 'react-icons/io5'
import { 
  BsSkipStartFill, BsSkipEndFill,
  BsReverseLayoutSidebarInsetReverse, 
  BsSkipEnd, BsAspectRatioFill,  
 } from 'react-icons/bs'
import { 
  FaUserCircle,
  FaExclamationCircle,
  FaRegCheckCircle,
} from 'react-icons/fa'
import { BiShapeTriangle, BiBorderOuter, BiBorderInner } from 'react-icons/bi'
import { GiDirectorChair } from 'react-icons/gi'
import { 
  TbArrowBarToRight, TbArrowBarRight, TbFileImport, TbActivityHeartbeat, TbArrowAutofitWidth, TbArrowAutofitHeight
} from 'react-icons/tb'
import { TiZoomOutOutline, TiZoomInOutline } from 'react-icons/ti'
import { 
  GiMove, GiResize, 
  GiHorizontalFlip, GiVerticalFlip,
 } from 'react-icons/gi'
import { HiEye, HiLockClosed, HiLockOpen } from 'react-icons/hi'
import { 
  VscTriangleRight, 
  VscTriangleDown,
} from 'react-icons/vsc'
import { ImFileVideo, ImSpinner3 } from 'react-icons/im'

import { ThemeIcons } from '@moviemasher/client-react'

const MMWideIcon = () => {
  return <svg width="2em" height="1em" viewBox="0 0 48 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <path d="M 0.00 0.00 L 48.00 0.00 L 48.00 24.00 L 0.00 24.00 Z M 0.00 0.00" stroke="none" fill="none" />
    <path d="M 9.16 2.00 C 8.62 2.00 8.13 2.18 7.73 2.57 L 7.73 2.57 L 1.19 8.91 C 0.77 9.34 0.55 9.82 0.53 10.39 L 0.53 10.39 C 0.53 10.91 0.72 11.37 1.13 11.76 L 1.13 11.76 C 1.56 12.15 2.05 12.31 2.60 12.28 L 2.60 12.28 C 3.17 12.31 3.64 12.13 4.03 11.70 L 4.03 11.70 L 9.16 6.90 L 13.67 11.28 C 14.33 11.87 14.67 12.20 14.73 12.24 L 14.73 12.24 C 15.12 12.63 15.60 12.81 16.14 12.81 L 16.14 12.81 C 16.69 12.85 17.20 12.66 17.63 12.28 L 17.63 12.28 C 17.67 12.26 18.01 11.93 18.63 11.28 L 18.63 11.28 C 19.29 10.65 20.07 9.93 20.93 9.12 L 20.93 9.12 C 21.82 8.23 22.57 7.51 23.20 6.90 L 23.20 6.90 L 31.34 14.86 C 31.74 15.25 32.21 15.47 32.72 15.51 L 32.72 15.51 L 38.29 15.51 L 38.23 19.10 L 44.00 13.55 L 38.29 7.90 L 38.29 11.54 L 33.65 11.48 L 24.63 2.63 C 24.22 2.28 23.74 2.09 23.20 2.09 L 23.20 2.09 C 22.65 2.07 22.16 2.24 21.71 2.63 L 21.71 2.63 L 16.20 8.01 L 11.64 3.63 C 10.98 2.96 10.64 2.61 10.60 2.57 L 10.60 2.57 C 10.18 2.18 9.75 2.00 9.28 2.00 L 9.28 2.00 C 9.24 2.00 9.20 2.00 9.16 2.00" stroke="none" fill="currentColor"  />
    <path d="M 7.70 11.61 L 2.58 16.53 L 0.00 14.05 L 0.00 21.91 L 8.15 21.91 L 5.49 19.38 C 5.53 19.38 5.56 19.36 5.60 19.32 L 5.60 19.32 L 9.19 15.88 L 14.75 21.28 C 15.14 21.67 15.62 21.85 16.16 21.85 L 16.16 21.85 C 16.73 21.89 17.22 21.72 17.65 21.33 L 17.65 21.33 L 23.16 15.88 L 28.78 21.43 C 29.18 21.78 29.67 21.96 30.21 21.96 L 30.21 21.96 L 34.34 22.00 C 34.93 21.98 35.42 21.78 35.83 21.43 L 35.83 21.43 C 36.23 21.04 36.44 20.56 36.44 19.95 L 36.44 19.95 C 36.44 19.39 36.23 18.91 35.83 18.53 L 35.83 18.53 C 35.46 18.17 34.99 18.01 34.40 18.01 L 34.40 18.01 L 31.10 17.95 L 24.65 11.67 C 24.25 11.32 23.76 11.13 23.22 11.13 L 23.22 11.13 C 22.67 11.11 22.18 11.28 21.75 11.67 L 21.75 11.67 L 16.16 16.99 L 10.56 11.61 C 10.15 11.22 9.69 11.04 9.19 11.04 L 9.19 11.04 C 8.64 11.04 8.15 11.22 7.70 11.61" stroke="none" fill="currentColor"  />
  </svg>
}

const MMIcon = () => {
  return <svg width="1em" height="1em" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <path d="M 0.00 0.00 L 24.00 0.00 L 24.00 24.00 L 0.00 24.00 Z M 0.00 0.00" stroke="none" fill="none" />
    <path d="M 4.20 11.29 L 1.41 13.99 L 0.00 12.63 L 0.00 16.95 L 4.44 16.95 L 2.99 15.56 C 3.01 15.56 3.03 15.55 3.06 15.53 L 3.06 15.53 L 5.01 13.64 L 8.04 16.60 C 8.26 16.82 8.52 16.92 8.82 16.92 L 8.82 16.92 C 9.13 16.94 9.39 16.85 9.63 16.63 L 9.63 16.63 L 12.63 13.64 L 15.70 16.68 C 15.91 16.88 16.18 16.98 16.48 16.98 L 16.48 16.98 L 18.73 17.00 C 19.05 16.99 19.32 16.88 19.55 16.68 L 19.55 16.68 C 19.76 16.47 19.88 16.21 19.88 15.87 L 19.88 15.87 C 19.88 15.57 19.76 15.30 19.55 15.09 L 19.55 15.09 C 19.34 14.90 19.08 14.80 18.76 14.80 L 18.76 14.80 L 16.96 14.77 L 13.45 11.32 C 13.23 11.12 12.96 11.02 12.66 11.02 L 12.66 11.02 C 12.37 11.01 12.10 11.10 11.86 11.32 L 11.86 11.32 L 8.82 14.25 L 5.76 11.29 C 5.53 11.07 5.29 10.97 5.01 10.97 L 5.01 10.97 C 4.71 10.97 4.44 11.07 4.20 11.29 M 5.00 6.00 C 4.70 6.00 4.43 6.10 4.22 6.32 L 4.22 6.32 L 0.65 9.80 C 0.42 10.04 0.30 10.30 0.29 10.62 L 0.29 10.62 C 0.29 10.90 0.39 11.15 0.62 11.37 L 0.62 11.37 C 0.85 11.58 1.12 11.67 1.42 11.65 L 1.42 11.65 C 1.73 11.67 1.98 11.57 2.20 11.34 L 2.20 11.34 L 5.00 8.69 L 7.46 11.10 C 7.82 11.43 8.00 11.61 8.03 11.63 L 8.03 11.63 C 8.25 11.85 8.51 11.95 8.81 11.95 L 8.81 11.95 C 9.10 11.97 9.38 11.87 9.62 11.65 L 9.62 11.65 C 9.64 11.64 9.82 11.46 10.16 11.10 L 10.16 11.10 C 10.52 10.76 10.95 10.36 11.42 9.91 L 11.42 9.91 C 11.90 9.43 12.31 9.03 12.65 8.69 L 12.65 8.69 L 17.10 13.08 C 17.31 13.29 17.57 13.41 17.85 13.43 L 17.85 13.43 L 20.88 13.43 L 20.85 15.40 L 24.00 12.35 L 20.88 9.24 L 20.88 11.25 L 18.35 11.21 L 13.43 6.35 C 13.21 6.15 12.95 6.05 12.65 6.05 L 12.65 6.05 C 12.35 6.04 12.09 6.13 11.84 6.35 L 11.84 6.35 L 8.84 9.30 L 6.35 6.89 C 5.99 6.53 5.80 6.34 5.78 6.32 L 5.78 6.32 C 5.55 6.10 5.32 6.00 5.06 6.00 L 5.06 6.00 C 5.04 6.00 5.02 6.00 5.00 6.00" stroke="none" fill="currentColor" />
  </svg>
}
const MMTubeIcon = () => {
  return <svg width="1em" height="1em" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <clipPath id="tube-m-m">
        <path d="
          M 3.60 21.00 C 1.61 21.00 0.00 19.39 0.00 17.40 L 0.00 6.60 C 0.00 4.61 1.61 3.00 3.60 3.00 L 20.40 3.00 C 22.39 3.00 24.00 4.61 24.00 6.60 L 24.00 17.40 C 24.00 19.39 22.39 21.00 20.40 21.00 Z M 3.60 21.00
          M 5.57 11.81 L 3.03 14.30 L 1.75 13.04 L 1.75 17.03 L 5.79 17.03 L 4.47 15.75 C 4.49 15.75 4.51 15.74 4.53 15.72 L 4.53 15.72 L 6.30 13.97 L 9.06 16.71 C 9.26 16.91 9.49 17.00 9.76 17.00 L 9.76 17.00 C 10.04 17.02 10.28 16.94 10.50 16.74 L 10.50 16.74 L 13.23 13.97 L 16.01 16.79 C 16.21 16.96 16.45 17.06 16.72 17.06 L 16.72 17.06 L 18.77 17.08 C 19.06 17.07 19.30 16.96 19.51 16.79 L 19.51 16.79 C 19.70 16.59 19.81 16.35 19.81 16.04 L 19.81 16.04 C 19.81 15.75 19.70 15.51 19.51 15.31 L 19.51 15.31 C 19.32 15.14 19.09 15.05 18.80 15.05 L 18.80 15.05 L 17.16 15.02 L 13.97 11.83 C 13.77 11.65 13.53 11.56 13.26 11.56 L 13.26 11.56 C 12.99 11.55 12.74 11.64 12.53 11.83 L 12.53 11.83 L 9.76 14.54 L 6.99 11.81 C 6.78 11.61 6.56 11.51 6.30 11.51 L 6.30 11.51 C 6.03 11.51 5.79 11.61 5.57 11.81
          M 6.29 6.93 C 6.02 6.93 5.78 7.02 5.58 7.22 L 5.58 7.22 L 2.34 10.43 C 2.14 10.65 2.02 10.89 2.01 11.18 L 2.01 11.18 C 2.01 11.45 2.11 11.68 2.31 11.88 L 2.31 11.88 C 2.53 12.08 2.77 12.16 3.04 12.14 L 3.04 12.14 C 3.32 12.16 3.56 12.07 3.75 11.85 L 3.75 11.85 L 6.29 9.41 L 8.53 11.64 C 8.85 11.94 9.02 12.10 9.05 12.12 L 9.05 12.12 C 9.25 12.32 9.48 12.41 9.75 12.41 L 9.75 12.41 C 10.02 12.43 10.27 12.34 10.49 12.14 L 10.49 12.14 C 10.51 12.13 10.68 11.96 10.98 11.64 L 10.98 11.64 C 11.31 11.32 11.70 10.95 12.12 10.54 L 12.12 10.54 C 12.56 10.09 12.94 9.72 13.25 9.41 L 13.25 9.41 L 17.28 13.46 C 17.48 13.65 17.71 13.76 17.97 13.78 L 17.97 13.78 L 20.72 13.78 L 20.69 15.60 L 23.55 12.79 L 20.72 9.92 L 20.72 11.77 L 18.42 11.74 L 13.96 7.24 C 13.75 7.07 13.52 6.97 13.25 6.97 L 13.25 6.97 C 12.98 6.96 12.73 7.05 12.51 7.24 L 12.51 7.24 L 9.78 9.97 L 7.52 7.75 C 7.19 7.41 7.02 7.24 7.00 7.22 L 7.00 7.22 C 6.80 7.02 6.58 6.93 6.35 6.93 L 6.35 6.93 C 6.33 6.93 6.31 6.93 6.29 6.93
        " />
      </clipPath>
    </defs>
    <path clipPath="url(#tube-m-m)" d="M 0.00 0.00 L 24.00 0.00 L 24.00 24.00 L 0.00 24.00 Z M 0.00 0.00" stroke="none" fill="currentColor" />
  </svg>
}

export const Icons: ThemeIcons = {
  active: <ImSpinner3 key='active' />,
  activity: <TbActivityHeartbeat key='activity' />,
  add: <RiAddLine key='add' />,
  administrator: <RiUserSettingsFill key='administrator' />,
  app: <img key='logo' src="mm.svg" />,
  audible: <RiVolumeUpLine key='audible' />,
  audio: <RiMusicLine key="audio" />,
  broadcast: <RiBroadcastFill key='broadcast' />,
  browser: <MdPermMedia key='browser' />,
  browserAudio: <RiMusic2Fill key="browserAudio" />,
  browserAudioStream: <RiChatVoiceFill key="browserAudioStream" />,
  browserEffect: <MdInvertColors key="browserEffect" />,
  browserImage: <RiImageFill key="browserImage" />,
  browserShape: <BiShapeTriangle key="browserShape" />,
  browserText: <MdOutlineTextFields key="browserText" />,
  browserVideo: <RiFilmFill key="browserVideo" />,
  browserVideoStream: <RiVideoChatFill key="browserVideoStream" />,
  chat: <RiChat3Fill key='chat' />,
  clip: <MdOutlineTimelapse key="clip" />,
  collapse: <VscTriangleDown key="collapse" />,
  collapsed: <VscTriangleRight key="collapsed" />,
  color: <IoMdColorFill key="color" />,
  complete: <FaRegCheckCircle key='complete' />,
  composer: <GiDirectorChair key='composer' />,
  container: <BiBorderOuter key="container" />,
  content: <BiBorderInner key="content" />,
  document: <IoDocument key="document" />,
  end: <BsSkipEndFill key="end" />,
  endUndefined: <BsSkipEnd key="endUndefined" />,
  gain: <RiVolumeUpLine key="gain" />,
  error: <FaExclamationCircle key='error' />,
  folder: <RiFolderLine key='folder' />,
  folderAdd: <RiFolderAddFill key='folderAdd' />,
  folderOpen: <RiFolderOpenLine key='folderOpen' />,
  frame: <TbArrowBarRight key="frame" />,
  frames: <TbArrowBarToRight key="frames" />,
  height: <TbArrowAutofitHeight key="height" />,
  horz: <GiHorizontalFlip key="horz-flip" />,
  inaudible: <RiVolumeMuteLine key='inaudible' />,
  inspector: <RiEdit2Fill key='inspector' />,
  invisible: <RiEyeOffLine key='invisible' />,
  label: <MdLabel key="label" />,
  lock: <HiLockClosed key="lock" />,
  matte: <BsReverseLayoutSidebarInsetReverse key="matte" />,
  message: <RiMessage3Fill key='message' />,
  mm: <MMIcon key="mm" />,
  mmTube: <MMTubeIcon key="mmTube" />,
  mmWide: <MMWideIcon key="mmWide" />,
  opacity: <MdOpacity key="opacity" />,
  playerPause: <RiPauseCircleFill key="player-pause" />,
  playerPlay: <RiPlayCircleFill key="player-play"/>,
  point: <GiMove key="point" />,
  redo: <RiArrowGoForwardLine key="redo" />,
  muted: <RiVolumeMuteLine key="muted" />,
  remove: <RiDeleteBin7Line key="remove" />,
  render: <ImFileVideo key="render" />,
  size: <GiResize key="size" />,
  sizing: <BsAspectRatioFill key="sizing" />,
  start: <BsSkipStartFill key="start" />,
  streamers: <FaUserCircle key='streamers' />,
  timeline: <MdOutlineTimelapse key='timeline' />,
  timing: <AiOutlineColumnWidth key="timing" />,
  startTrim: <CgArrowLongRightL key="start-trim" />,
  speed: <MdOutlineSpeed key="speed" />,
  endTrim: <CgArrowLongLeftL key="end-trim" />,
  track: <RiStackLine key="track" />,
  trackDense: <RiStackFill key="track-dense"/>,
  undo: <RiArrowGoBackLine key="undo" />,
  unlock: <HiLockOpen key="unlock" />,
  upload: <TbFileImport key="upload" />,
  vert: <GiVerticalFlip key="vert" />,
  video: <RiArrowRightSLine key="video" />,
  view: <HiEye key="view" />,
  visible: <RiEyeLine key='visible' />,
  width: <TbArrowAutofitWidth key="width" />,
  zoomLess: <TiZoomOutOutline key="zoom-less" />,
  zoomMore: <TiZoomInOutline key="zoom-more" />,
}
