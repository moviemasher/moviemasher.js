import type { Propertied, Size, Time, TimeRange } from '@moviemasher/runtime-shared'
import type { MashAsset } from '@moviemasher/runtime-shared'
import type { ClientAudioAsset, ClientImageAsset, ClientVideoAsset } from '../ClientTypes.js'
import type { ClientAsset } from "@moviemasher/runtime-client"
import type { ClientInstance, ClientVisibleInstance } from '../ClientTypes.js'
import type { Track, TrackObject } from '@moviemasher/runtime-shared'
import type { Panel } from '../../Base/PanelTypes.js'
import type { PreviewItem, PreviewItems, SvgOrImage } from '../../Helpers/Svg/Svg.js'
import type { Masher } from '../../Plugin/Masher/Masher.js'
import type { AudioPreview } from '../../Plugin/Masher/Preview/AudioPreview/AudioPreview.js'
import type { AVType } from '@moviemasher/runtime-shared'
import type { Selectable } from '@moviemasher/runtime-client'
import type { Clip } from '@moviemasher/runtime-shared'
import type { ClientAssetManager } from '@moviemasher/runtime-client'
import type { AudioInstance, AudioInstanceObject } from '@moviemasher/runtime-shared'
import type { Instance, InstanceArgs, InstanceObject } from '@moviemasher/runtime-shared'
import type { ImageInstance, ImageInstanceObject } from '@moviemasher/runtime-shared'
import type { VideoInstance, VideoInstanceObject } from '@moviemasher/runtime-shared'

export interface ClientMashAsset extends ClientAsset, MashAsset {

  instanceFromObject(object?: InstanceObject): Instance
  instanceArgs(object?: InstanceObject): InstanceObject & InstanceArgs
  
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

  frame: number
  timeRange: TimeRange

  media: ClientAssetManager
  loading: boolean
  paused: boolean
  mashPreviewItemsPromise(masher?: Masher): Promise<PreviewItems>
  putPromise(): Promise<void>
  reload(): Promise<void> | undefined
  removeClipFromTrack(clip : ClientClip | ClientClips) : void
  removeTrack(index?: number): void
  seekToTime(time: Time): Promise<void> | undefined
  time: Time
  timeToBuffer: Time
  tracks: ClientTracks
}


export interface ClientMashAudioAsset extends ClientMashAsset, ClientAudioAsset {
  instanceFromObject(object?: AudioInstanceObject): AudioInstance
}

export interface ClientMashImageAsset extends ClientMashAsset, ClientImageAsset {
  instanceFromObject(object?: ImageInstanceObject): ImageInstance
}

export interface ClientMashVideoAsset extends ClientMashAsset, ClientVideoAsset {
  instanceFromObject(object?: VideoInstanceObject): VideoInstance
}


export interface ClientMashInstance extends ClientInstance, Instance {
  asset: ClientMashAsset
}


export interface ClientMashAudioInstance extends AudioInstance, ClientInstance {
  asset: ClientMashAudioAsset
}

export interface ClientMashImageInstance extends ImageInstance, ClientInstance {
  asset: ClientMashImageAsset
}

export interface ClientMashVideoInstance extends VideoInstance, ClientInstance {
  asset: ClientMashVideoAsset
}


export interface ClientClip extends Selectable, Clip {
  content: ClientInstance
  container?: ClientVisibleInstance
  clipIcon(size: Size, scale: number, spacing?: number, color?: string): Promise<SvgOrImage> | undefined
  clipPreviewItemsPromise(size: Size, time: Time, component: Panel): Promise<PreviewItem>
  track: ClientTrack
}
export type ClientClips = ClientClip[]

export interface ClientTrack extends Track, Selectable {
  mash: ClientMashAsset
  clips: ClientClips
  addClips(clip: ClientClips, insertIndex?: number): void
  frameForClipNearFrame(clip: ClientClip, frame?: number): number
  removeClips(clip: ClientClips): void
}
export type ClientTracks = ClientTrack[]

export interface ClientTrackArgs extends TrackObject {
  mashAsset: ClientMashAsset
}
