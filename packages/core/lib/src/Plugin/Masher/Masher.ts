import type { VideoStreamType, AudioStreamType } from '../../Setup/Enums.js'
import type { ClientAction } from "../../Setup/ClientAction.js"
import { MasherType, Plugin, TypesAsset} from '@moviemasher/runtime-shared'
import type { Action } from "./Actions/Action/Action.js"
import type {EditorSelection} from './EditorSelection/EditorSelection.js'
import type {ClientEffect} from '../../Effect/Effect.js'
import type {EncodingType} from '../Encode/Encoding/Encoding.js'
import type {IndexHandler} from '../../Helpers/Select/Select.js'
import type { Movable } from "../../Setup/Movable.js"
import type {PreviewItems} from '../../Helpers/Svg/Svg.js'
import type {Rect} from '@moviemasher/runtime-shared'
import type {Size} from '@moviemasher/runtime-shared'
import type {StringRecord} from '@moviemasher/runtime-shared'
import type {Time, TimeRange} from '@moviemasher/runtime-shared'
import type {Track} from '../../Shared/Mash/Track/Track.js'

import {Actions} from './Actions/Actions.js'
import {Emitter} from '../../Helpers/Emitter.js'
import {errorThrow} from '../../Helpers/Error/ErrorFunctions.js'
import { TypeAudioStream, TypeVideoStream } from "../../Setup/EnumConstantsAndFunctions.js"
import { AssetCollection } from '../../Shared/Asset/AssetCollection/AssetCollection.js'
import { MashAsset, MashAssetObject } from '../../Shared/Mash/MashTypes.js'
import { ClientAsset, ClientAssets } from "../../Client/ClientTypes.js"
import { AssetObject, AssetObjects } from '../../Shared/Asset/Asset.js'
import { ClientClip, ClientClips } from '../../Client/Mash/MashClientTypes.js'
import { ClientAssetCollection } from '../../Client/Asset/AssetCollection/ClientAssetCollection.js'

export interface Masher {
  actions: Actions
  addEffect: IndexHandler<Movable>
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
  mashingType: MashingType
  media: ClientAssetCollection
  move(object: ClipOrEffect, editorIndex?: MashIndex): void
  moveClip(clip: ClientClip, editorIndex?: MashIndex): void
  moveEffect: IndexHandler<Movable>
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
  removeEffect: IndexHandler<Movable>
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
export interface PluginsByMashing extends Record<MashingType, MasherPlugin> {}

export type MashingType = string | EncodingType | VideoStreamType | AudioStreamType
export type MashingTypes = MashingType[]
export const MashingTypes: MashingTypes = [...TypesAsset, TypeVideoStream, TypeAudioStream]
export const isMashingType = (type?: any): type is MashingType => {
  return MashingTypes.includes(type)
}
export function assertMashingType(value: any, name?: string): asserts value is MashingType {
  if (!isMashingType(value)) errorThrow(value, 'MashingType', name)
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
  eventTarget?: Emitter
  fps: number
  loop: boolean
  mash?: MashAssetObject
  mashingType?: MashingType
  patchSvg?: SVGSVGElement
  precision: number
  readOnly?: boolean
  volume: number
}

export interface MasherOptions extends Partial<MasherArgs> { }

export type ClipOrEffect = ClientClip | ClientEffect
