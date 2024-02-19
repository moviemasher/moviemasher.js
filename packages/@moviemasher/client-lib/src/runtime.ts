import type { ManageType, Point, Size } from '@moviemasher/shared-lib/types.js'
import type { ClientAsset, EventFunction } from './types.js'

import { $CLIP, MOVIEMASHER, errorThrow, isAsset, $COLOR, $ENCODE } from '@moviemasher/shared-lib/runtime.js'


export const ADD = 'add'
export const ADD_TRACK = 'add-track'
export const CHANGE_FRAME = 'change-frame'
export const MOVE_CLIP = 'move-clip'
export const PLAY = 'play'
export const REDO = 'redo'
export const REMOVE = 'remove'
export const REMOVE_CLIP = 'remove-clip'
export const SAVE = 'save'
export const UNDO = 'undo'
export const VIEW = 'view'
export const TRANSLATE = 'translate'

export const IMPORT: ManageType = 'import'
export const REFERENCE: ManageType = 'reference'

export const ICON = 'icon'


export const SELECTED = 'selected'
export const ROW = 'row'
export const DROPPING = 'dropping'
export const LAYER = 'layer'
export const OUTLINE = 'outline'
export const OUTLINES = 'outlines'
export const BOUNDS = 'bounds'
export const BACK = 'back'
export const LINE = 'line'
export const HANDLE = 'handle'
export const FORE = 'fore'
export const ANIMATE = 'animate'
export const X_MOVIEMASHER = '/x-moviemasher'

export const INDEX_LAST = -1
export const INDEX_CURRENT = -2
export const INDEX_NEXT = -3

export const eventStop: EventFunction = event => {
  event.preventDefault()
  event.stopPropagation()
}

export const isClientAsset = (value: any): value is ClientAsset => {
  return isAsset(value) && 'assetIcon' in value
}

export type DatasetElement = HTMLElement | SVGElement

export const isDatasetElement = (value: any): value is DatasetElement => (
  value instanceof HTMLElement || value instanceof SVGElement
)

export function assertDatasetElement(value: any, name?: string): asserts value is DatasetElement {
  if (!isDatasetElement(value)) errorThrow(value, 'DatasetElement', name)
}


const Lib = '@moviemasher/client-lib'
// const SharedLib = '@moviemasher/shared-lib'

const HANDLER = `${Lib}/handler`
const CONTROLS = `${HANDLER}/controls.js`
// const Media = `${HANDLER}/media.js`
const SOURCE = `${Lib}/source`
const RAW = `${SOURCE}/raw/raw.js`

MOVIEMASHER.imports = {
  [$CLIP]: `${Lib}/timeline/timeline-clip.js`,
  ClientAssetElementListeners: `${HANDLER}/element.js`,

  [ICON]: `${HANDLER}/${ICON}.js`,
  [TRANSLATE]: `${HANDLER}/translate.js`,

  // assetModules
  ClientMashVideoListeners: `${SOURCE}/mash/video-mash.js`,
  [$COLOR]: `${SOURCE}/color/image-color.js`,
  ClientShapeImageListeners: `${SOURCE}/shape/image-shape.js`,
  ClientTextImageListeners: `${SOURCE}/text/image-text.js`,
  ClientRawAudioListeners: RAW,
  ClientRawImageListeners: RAW,
  ClientRawVideoListeners: RAW,

  // importModules
  ClientRawImportListeners: RAW,
  ClientTextImportListeners: `${SOURCE}/text/image-text-importer.js`,

  // actionModules
  // [$DECODE]: `${HANDLER}/decode.js`,
  [$ENCODE]: `${HANDLER}/encode.js`,
  [SAVE]: `${HANDLER}/save.js`,
  // [$TRANSCODE]: `${HANDLER}/transcode.js`,
  ClientAssetUploadListeners: `${HANDLER}/upload.js`,

  ClientAssetManagerListeners: `${HANDLER}/manager.js`,

  // controlModules
  ClientControlAssetListeners: CONTROLS,
  ClientControlBooleanListeners: CONTROLS,
  ClientControlNumericListeners: CONTROLS,
  ClientControlRgbListeners: CONTROLS,
  ClientControlStringListeners: CONTROLS,

  // controlGroupModules
  ClientGroupAspectListeners: CONTROLS,
  ClientGroupDimensionsListeners: CONTROLS,
  ClientGroupFillListeners: CONTROLS,
  ClientGroupLocationListeners: CONTROLS,
  ClientGroupTimeListeners: CONTROLS,
}


export const MANAGE_TYPES = [IMPORT, REFERENCE]

export const isManageType = (value: any): value is ManageType => (
  MANAGE_TYPES.includes(value as ManageType)
)

export const centerPoint = (size: Size, inSize: Size): Point => {
  return {
    x: Math.round((size.width - inSize.width) / 2),
    y: Math.round((size.height - inSize.height) / 2)
  }
}

