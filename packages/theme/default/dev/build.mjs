import fs from 'fs'
import path from 'path'

import { svgStringFromFile, svgStringFromComponent } from "../../../../dev/utils/svgString.mjs"

import { 
  AiOutlineColumnWidth,
} from 'react-icons/ai/index.js'
import { 
  BiBorderOuter, BiBorderInner 
} from 'react-icons/bi/index.js'
import { 
  BsSkipStartFill, BsSkipEndFill,
  
  BsSkipEnd, BsAspectRatioFill
  ,
 } from 'react-icons/bs/index.js'
import { 
  CgArrowLongRightL, CgArrowLongLeftL} from 'react-icons/cg/index.js'
import { 
  FaExclamationCircle,
  FaRegCheckCircle,
} from 'react-icons/fa/index.js'
import { 
  GiMove, GiResize, 
  GiHorizontalFlip, GiVerticalFlip,
 } from 'react-icons/gi/index.js'
import { 
  HiEye, HiLockClosed, HiLockOpen} from 'react-icons/hi/index.js'
import { 
  ImFileVideo 
} from 'react-icons/im/index.js'
import { 
  IoMdColorFill,
} from 'react-icons/io/index.js'
import { 
  IoDocument, 
} from 'react-icons/io5/index.js'
import { 
  MdInvertColors,
  MdPermMedia, 
  MdOutlineTextFields, 
  MdOutlineTimelapse,
  MdOpacity, MdLabel,
  MdOutlineSpeed, 
  MdIncompleteCircle,
} from 'react-icons/md/index.js'
import { 
  RiMusic2Fill,
  RiFilmFill,
  RiPlayCircleFill,
  RiPauseCircleFill,
  RiImageFill,
  RiArrowGoBackLine,
  RiArrowGoForwardLine,
  RiDeleteBin7Line,
  RiAddLine,
  RiEyeOffLine,
  RiVolumeUpLine,
  RiVolumeMuteLine,
  RiBroadcastFill,
  RiStackFill,
  RiStackLine,
  RiEdit2Fill,
} from 'react-icons/ri/index.js'
import { 
  TbArrowBarToRight, TbArrowBarRight, TbFileImport, TbActivityHeartbeat, TbArrowAutofitWidth, TbArrowAutofitHeight
} from 'react-icons/tb/index.js'
import { 
  TiZoomOutOutline, TiZoomInOutline 
} from 'react-icons/ti/index.js'
import { 
  VscTriangleRight, 
  VscTriangleDown,
} from 'react-icons/vsc/index.js'


(() => {
  const componentsById = {
    active: MdIncompleteCircle,
    activity: TbActivityHeartbeat,
    add: RiAddLine,
    audio: RiMusic2Fill,
    broadcaster: RiBroadcastFill,
    browser: MdPermMedia,
    clip: MdOutlineTimelapse,
    collapse: VscTriangleDown,
    collapsed: VscTriangleRight,
    color: IoMdColorFill,
    complete: FaRegCheckCircle,
    container: BiBorderOuter,
    content: BiBorderInner,
    document: IoDocument,
    effect: MdInvertColors,
    encode: ImFileVideo,
    end: BsSkipEndFill,
    endTrim: CgArrowLongLeftL,
    endUndefined: BsSkipEnd,
    error: FaExclamationCircle,
    font: MdOutlineTextFields,
    frame: TbArrowBarRight,
    frames: TbArrowBarToRight,
    gain: RiVolumeUpLine,
    height: TbArrowAutofitHeight,
    horz: GiHorizontalFlip,
    image: RiImageFill,
    inaudible: RiVolumeMuteLine,
    inspector: RiEdit2Fill,
    invisible: RiEyeOffLine,
    label: MdLabel,
    lock: HiLockClosed,
    muted: RiVolumeMuteLine,
    opacity: MdOpacity,
    pause: RiPauseCircleFill,
    play: RiPlayCircleFill,
    point: GiMove,
    redo: RiArrowGoForwardLine,
    remove: RiDeleteBin7Line,
    size: GiResize,
    sizing: BsAspectRatioFill,
    speed: MdOutlineSpeed,
    start: BsSkipStartFill,
    startTrim: CgArrowLongRightL,
    timeline: MdOutlineTimelapse,
    timing: AiOutlineColumnWidth,
    track: RiStackLine,
    trackDense: RiStackFill,
    undo: RiArrowGoBackLine,
    unlock: HiLockOpen,
    upload: TbFileImport,
    vert: GiVerticalFlip,
    video: RiFilmFill,
    view: HiEye,
    width: TbArrowAutofitWidth,
    zoomLess: TiZoomOutOutline,
    zoomMore: TiZoomInOutline,
  }
  const svgStringsById = Object.fromEntries(Object.entries(componentsById).map(([id, component]) => (
    [id, svgStringFromComponent(component)]
  )))
  const baseDir = path.resolve('./')
  const svgDir = path.join(baseDir, 'src/svg')
  const allFiles = fs.readdirSync(svgDir)
  const filtered = allFiles.filter(file => path.extname(file) === '.svg')
  filtered.forEach(file => {
    const svgPath = path.join(svgDir, file)
    const svgString = svgStringFromFile(svgPath)
    const id = path.basename(file, '.svg')
    svgStringsById[id] = svgString
  })
  const keys = Object.keys(svgStringsById).sort()
  const sorted = Object.fromEntries(keys.map(key => [key, svgStringsById[key]]))

  const jsonPath = path.join(svgDir, 'svg.json')
  const jsonText = JSON.stringify(sorted, null, 2)
  fs.writeFileSync(jsonPath, jsonText)
  console.log('Wrote', keys.length, 'SVG strings to', jsonPath.slice(baseDir.length + 1))
})()
