import type { EventDispatcher, EventDispatcherListener, EventDispatcherListeners, EventOptions, ManageType } from '@moviemasher/shared-lib/types.js'
import type { ClientAsset, EventFunction, Panel } from './types.js'

import { AUDIO, CLIP_TARGET, COLOR, DECODE, ENCODE, IMAGE, MOVIEMASHER, BITMAPS, SVG, TRANSCODE, VIDEO, WAVEFORM, errorThrow, isAsset } from '@moviemasher/shared-lib/runtime.js'


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

export const BROWSER: Panel = 'browser'
export const PLAYER: Panel = 'player'
export const TIMELINE: Panel = 'timeline'
export const IMPORTER: Panel = 'importer'
export const EXPORTER: Panel = 'exporter'

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
export const MIME_SVG: DOMParserSupportedType = `${IMAGE}/${SVG}+xml`

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

export class ClientEventDispatcher extends EventTarget implements EventDispatcher {
  addDispatchListener<T>(type: string, listener: EventDispatcherListener<T>, options?: EventOptions): EventDispatcher {
    this.addEventListener(type, listener as EventListener, options);
    return this;
  }

  dispatch<T>(event: CustomEvent<T> | Event): boolean {
    return this.dispatchEvent(event);
  }

  listenersAdd(record: EventDispatcherListeners) {
    Object.entries(record).forEach(([type, listener]) => {
      this.addDispatchListener(type, listener);
    });
  }

  listenersRemove(record: EventDispatcherListeners) {
    Object.entries(record).forEach(([type, listener]) => {
      this.removeDispatchListener(type, listener);
    });
  }

  removeDispatchListener<T>(type: string, listener: EventDispatcherListener<T>, options?: EventOptions): EventDispatcher {
    this.removeEventListener(type, listener as EventListener, options);
    return this;
  }
}

const Lib = '@moviemasher/client-lib'
const HANDLER = `${Lib}/handler`
const Controls = `${HANDLER}/controls.js`
const Media = `${HANDLER}/media.js`
const Source = `${Lib}/source`
const Raw = `${Source}/raw/raw.js`

MOVIEMASHER.imports = {
  [CLIP_TARGET]: `${Lib}/timeline/timeline-clip.js`,
  [COLOR]: `${Source}/color/image-color.js`,
  [DECODE]: `${HANDLER}/decode.js`,
  [ENCODE]: `${HANDLER}/encode.js`,
  [ICON]: `${HANDLER}/${ICON}.js`,
  [SAVE]: `${HANDLER}/save.js`,
  [TRANSCODE]: `${HANDLER}/transcode.js`,
  [TRANSLATE]: `${HANDLER}/translate.js`,
  ClientAssetElementListeners: `${HANDLER}/element.js`,
  ClientAssetManagerListeners: `${HANDLER}/manager.js`,
  ClientAssetUploadListeners: `${HANDLER}/upload.js`,
  ClientAudioListeners: Media,
  ClientControlAssetListeners: Controls,
  ClientControlBooleanListeners: Controls,
  ClientControlNumericListeners: Controls,
  ClientControlRgbListeners: Controls,
  ClientControlStringListeners: Controls,
  ClientFontListeners: Media,
  ClientGroupAspectListeners: Controls,
  ClientGroupDimensionsListeners: Controls,
  ClientGroupFillListeners: Controls,
  ClientGroupLocationListeners: Controls,
  ClientGroupTimeListeners: Controls,
  ClientImageListeners: Media,
  ClientMashVideoListeners: `${Source}/mash/video-mash.js`,
  ClientRawAudioListeners: Raw,
  ClientRawImageListeners: Raw,
  ClientRawImportListeners: Raw,
  ClientRawVideoListeners: Raw,
  ClientShapeImageListeners: `${Source}/shape/image-shape.js`,
  ClientTextImageListeners: `${Source}/text/image-text.js`,
  ClientTextImportListeners: `${Source}/text/image-text-importer.js`,
  ClientVideoListeners: Media,
}
MOVIEMASHER.options = {
  transcode: {
    [IMAGE]: [IMAGE],
    [VIDEO]: [BITMAPS, AUDIO, WAVEFORM],
    [AUDIO]: [AUDIO, WAVEFORM],
  }
}

export const MANAGE_TYPES = [IMPORT, REFERENCE]

export const isManageType = (value: any): value is ManageType => (
  MANAGE_TYPES.includes(value as ManageType)
)
