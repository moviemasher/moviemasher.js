import { Propertied, Size, Time, TimeRange } from '@moviemasher/runtime-shared'
import { MashAsset, MashAssetObject, MashInstance } from '../../Shared/Mash/MashTypes.js'
import { ClientAsset } from "../ClientTypes.js"
import { ClientInstance, ClientVisibleInstance } from '../ClientTypes.js'
import { Track, TrackObject } from '../../Shared/Mash/Track/Track.js'
import { Component, InstanceCacheArgs, PreloadArgs, PreloadOptions } from '../../Base/Code.js'
import { PreviewItem, PreviewItems, SvgOrImage } from '../../Helpers/Svg/Svg.js'
import { Masher } from '../../Plugin/Masher/Masher.js'
import { AudioPreview } from '../../Plugin/Masher/Preview/AudioPreview/AudioPreview.js'
import { AVType } from '../../Setup/AVType.js'
import { Selectable } from '../../Plugin/Masher/Selectable.js'
import { Clip } from '../../Shared/Mash/Clip/Clip.js'
import { ClientEffect } from '../../Effect/Effect.js'

export interface MashClientAsset extends ClientAsset, MashAsset {
  addClipToTrack(clip : ClientClip | ClientClips, trackIndex? : number, insertIndex? : number, frame? : number) : void
  addTrack(object?: TrackObject): Track
  buffer: number
  changeTiming(propertied: Propertied, property: string, value : number) : void
  clearPreview(): void
  clips: ClientClips
  clipsInTimeOfType(time: Time, avType?: AVType): ClientClips
  composition: AudioPreview
  destroy(): void
  draw() : void
  drawnTime? : Time
  editor: Masher
  frame: number
  loading: boolean
  paused: boolean
  mashPreviewItemsPromise(editor?: Masher): Promise<PreviewItems>
  putPromise(): Promise<void>
  reload(): Promise<void> | undefined
  removeClipFromTrack(clip : ClientClip | ClientClips) : void
  removeTrack(index?: number): void
  seekToTime(time: Time): Promise<void> | undefined
  time: Time
  timeRange: TimeRange
  timeToBuffer: Time
  tracks: ClientTracks
}

export interface MashClientInstance extends ClientInstance, MashInstance {
  effects: ClientEffect[]
  asset: MashClientAsset
}

export interface MashClientAssetObject extends MashAssetObject {
  editor: Masher
  loop?: boolean
  buffer?: number
}

export interface ClientClip extends Selectable, Clip {
  content: ClientInstance
  container?: ClientVisibleInstance
  clipIcon(size: Size, scale: number, spacing?: number, color?: string): Promise<SvgOrImage> | undefined
  clipCachePromise(args: InstanceCacheArgs): Promise<void>
  clipPreviewItemsPromise(size: Size, time: Time, component: Component): Promise<PreviewItem>
  track: ClientTrack
}
export type ClientClips = ClientClip[]

export interface ClientTrack extends Track, Selectable {
  mash: MashClientAsset
  clips: ClientClips
  addClips(clip: ClientClips, insertIndex?: number): void
  frameForClipNearFrame(clip: ClientClip, frame?: number): number
  removeClips(clip: ClientClips): void
}
export type ClientTracks = ClientTrack[]

export interface ClientTrackArgs extends TrackObject {
  mashAsset: MashClientAsset
}
