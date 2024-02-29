import type { ClientAsset, ManageType } from '@moviemasher/shared-lib/types.js'
import type { EventFunction } from './types.js'

import { $CLIP, $ENCODE, $SAVE, MOVIE_MASHER, errorThrow, isAsset } from '@moviemasher/shared-lib/runtime.js'

export const ADD = 'add'
export const ADD_TRACK = 'add-track'
export const MOVE_CLIP = 'move-clip'
export const PLAY = 'play'
export const REDO = 'redo'
export const REMOVE = 'remove'
export const REMOVE_CLIP = 'remove-clip'
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



const LIB = '@moviemasher/client-lib'
const MODULE = `${LIB}/module`
const HANDLER = `${LIB}/handler`
const CONTROLS = `${HANDLER}/controls.js`
const SOURCE = `${LIB}/source`

MOVIE_MASHER.imports = {
  ClientAssetManagerListeners: `${HANDLER}/manager.js`,
  [$CLIP]: `${LIB}/timeline/timeline-clip.js`,
  ClientAssetElementListeners: `${HANDLER}/element.js`,

  [ICON]: `${HANDLER}/${ICON}.js`,
  [TRANSLATE]: `${HANDLER}/translate.js`,

  // importModules
  ClientRawImportListeners: `${MODULE}/raw.js`,
  ClientTextImportListeners: `${SOURCE}/text/image-text-importer.js`,

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

  // actionModules
  [$ENCODE]: `${HANDLER}/encode.js`,
  [$SAVE]: `${MODULE}/save.js`,
}

const MANAGE_TYPES = [IMPORT, REFERENCE]

export const isManageType = (value: any): value is ManageType => (
  MANAGE_TYPES.includes(value as ManageType)
)

