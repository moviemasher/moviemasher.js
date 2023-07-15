import type { AssetObject, Time, MashAssetObject, AssetType, MashAsset, Rect, StringRecord, TimeRange, Size } from '@moviemasher/runtime-shared'
import type { Action } from './Action.js'
import type { Actions } from './Actions.js'
import type { ClientAction } from './ClientAction.js'
import type { ClientAssets } from './ClientAsset.js'
import type { ClientAssetManager } from './ClientAssetManager.js'
import type { ClientClip, ClientClips } from './ClientMashTypes.js'

export interface Masher {
  actions: Actions
  autoplay: boolean
  buffer: number
  can(action: ClientAction): boolean
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
  handleAction(action: Action): void
  load(data: AssetObject): Promise<void>
  loop: boolean
  mashingType: AssetType
  media: ClientAssetManager
  muted: boolean
  pause(): void
  paused: boolean
  play(): void
  position: number
  positionStep: number
  precision: number
  mashAsset?: MashAsset
  selection: ClientClip | false
  readOnly: boolean
  rect: Rect
  redo(): void
  redraw(): void
  saved(temporaryIdLookup?: StringRecord): void
  time: Time
  timeRange: TimeRange
  undo(): void
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
  dimensions?: Rect | Size | undefined
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

