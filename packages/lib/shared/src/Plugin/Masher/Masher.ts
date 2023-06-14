import type { ClientAction } from "../../Setup/ClientAction.js"
import type { AssetType, MasherType, Plugin} from '@moviemasher/runtime-shared'
import type { Action } from "@moviemasher/runtime-client"
import type {EditorSelection} from './EditorSelection/EditorSelection.js'
import type {PreviewItems} from '../../Helpers/Svg/Svg.js'
import type {Rect} from '@moviemasher/runtime-shared'
import type {Size} from '@moviemasher/runtime-shared'
import type {StringRecord} from '@moviemasher/runtime-shared'
import type {Time, TimeRange} from '@moviemasher/runtime-shared'
import type {Track} from '@moviemasher/runtime-shared'

import { Actions } from "@moviemasher/runtime-client"
import { Emitter } from '../../Helpers/Emitter.js'
import { MashAsset, MashAssetObject } from '@moviemasher/runtime-shared'
import { ClientAsset, ClientAssets } from "@moviemasher/runtime-client"
import { AssetObject, AssetObjects } from '@moviemasher/runtime-shared'
import { ClientClip, ClientClips } from '../../Client/Mash/ClientMashTypes.js'
import { ClientAssetManager } from '@moviemasher/runtime-client'

export interface Masher {
  actions: Actions
  addMedia(media: ClientAsset | ClientAssets, editorIndex?: MashIndex): Promise<ClientAssets> 
  addMediaObjects(object: AssetObject | AssetObjects, editorIndex?: MashIndex): Promise<ClientAssets>
  addTrack(): void
  autoplay: boolean
  buffer: number
  can(action: ClientAction): boolean
  clips: ClientClips
  create(): Promise<void>
  currentTime: number
  definitions: ClientAssets
  definitionsUnsaved: ClientAssets
  dragging: boolean
  duration: number
  editing: boolean
  eventTarget: Emitter
  fps: number
  goToTime(value: Time): Promise<void>
  handleAction(action: Action): void
  load(data: MashAssetObject): Promise<void>
  loop: boolean
  mashingType: AssetType
  media: ClientAssetManager
  move(clip: ClientClip, editorIndex?: MashIndex): void
  muted: boolean
  pause(): void
  paused: boolean
  play(): void
  position: number
  positionStep: number
  precision: number
  previewItems(enabled?: boolean): Promise<PreviewItems>
  readonly mashMedia?: MashAsset
  readonly selection: EditorSelection
  readOnly: boolean
  rect: Rect
  redo(): void
  redraw(): void
  removeClip(clip: ClientClip): void
  removeTrack(track: Track): void
  saved(temporaryIdLookup?: StringRecord): void
  time: Time
  timeRange: TimeRange
  undo(): void
  unload(): void
  volume: number
}

export interface MasherPlugin extends Plugin {
  type: MasherType
  masher(options?: MasherOptions): Masher
}


/**
 * @category Plugin
 */
export interface PluginsByMashing extends Record<AssetType | string, MasherPlugin> {}



export interface MashIndex {
  clip?: number
  track?: number
  effect?: number
}


export interface MasherArgs {
  autoplay: boolean
  buffer: number
  dimensions?: Rect | Size | undefined
  eventTarget?: Emitter
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

