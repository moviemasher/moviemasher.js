import type { AssetObject, AssetType, MashAsset, MashAssetObject, StringRecord, Time, TimeRange } from '@moviemasher/runtime-shared'
import type { Action, Actions } from './ActionTypes.js'
import type { ClientAssets } from './ClientAsset.js'
import type { ClientClip, ClientClips } from './ClientMashTypes.js'

export interface Masher {
  // actions: Actions
  autoplay: boolean
  buffer: number
  // can(action: ClientAction): boolean
  clips: ClientClips
  create(): Promise<void>
  currentTime: number
  definitions: ClientAssets
  definitionsUnsaved: ClientAssets
  destroy(): void
  dragging: boolean
  duration: number
  editing: boolean
  fps: number
  goToTime(value: Time): Promise<void>
  load(data: AssetObject): Promise<void>
  loop: boolean
  mashingType: AssetType
  muted: boolean
  // pause(): void
  paused: boolean
  // play(): void
  position: number
  positionStep: number
  precision: number
  // mashAsset?: MashAsset
  // selection: ClientClip | false
  // readOnly: boolean
  // rect: Rect
  // redo(): void
  redraw(): void
  saved(temporaryIdLookup?: StringRecord): void
  time: Time
  timeRange: TimeRange
  // undo(): void
  unload(): void
  volume: number
}

export interface MashIndex {
  clip?: number
  track?: number
  effect?: number
}

export interface MasherArgs {
  autoplay: boolean
  buffer: number
  fps: number
  loop: boolean
  mash?: MashAssetObject
  mashingType?: AssetType
  patchSvg?: SVGSVGElement
  precision: number
  readOnly?: boolean
  volume: number
}

export interface MasherOptions extends Partial<MasherArgs> { }

