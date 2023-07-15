import type { AVType, AudioInstance, AudioInstanceObject, Clip, ImageInstance, ImageInstanceObject, Instance, InstanceArgs, InstanceObject, MashAsset, Propertied, Size, Time, TimeRange, Track, TrackObject, VideoInstance, VideoInstanceObject } from '@moviemasher/runtime-shared'
import type { AudioPreview } from './AudioPreview.js'
import type { ClientAsset } from './ClientAsset.js'
import type { ClientAssetManager } from './ClientAssetManager.js'
import type { ClientAudioAsset, ClientImageAsset, ClientInstance, ClientVideoAsset, ClientVisibleInstance } from './ClientTypes.js'
import type { Masher } from './Masher.js'
import type { Panel } from './PanelTypes.js'
import type { Selectable } from './Selectable.js'
import type { PreviewItem, PreviewItems } from './Svg.js'
import type { SvgOrImageDataOrError } from './ClientEvents.js'

export interface ClientMashAsset extends ClientAsset, MashAsset {
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
  instanceArgs(object?: InstanceObject): InstanceObject & InstanceArgs
  instanceFromObject(object?: InstanceObject): Instance
  loading: boolean
  mashPreviewItemsPromise(masher?: Masher): Promise<PreviewItems>
  media: ClientAssetManager
  paused: boolean
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
  clipIcon(frameSize: Size, size: Size, scale: number, spacing?: number, color?: string): Promise<SvgOrImageDataOrError>
  clipPreviewItemsPromise(size: Size, time: Time, component: Panel): Promise<PreviewItem>
  container?: ClientVisibleInstance
  content: ClientInstance
  track: ClientTrack
}
export type ClientClips = ClientClip[]

export interface ClientTrack extends Track, Selectable {
  addClips(clip: ClientClips, insertIndex?: number): void
  clips: ClientClips
  frameForClipNearFrame(clip: ClientClip, frame?: number): number
  mash: ClientMashAsset
  removeClips(clip: ClientClips): void
}
export type ClientTracks = ClientTrack[]

export interface ClientTrackArgs extends TrackObject {
  mashAsset: ClientMashAsset
}
