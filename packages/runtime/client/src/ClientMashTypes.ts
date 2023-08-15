import type { AVType, AudioInstance, AudioInstanceObject, Clip, ClipObject, ImageInstance, ImageInstanceObject, Instance, InstanceArgs, InstanceObject, MashAsset, MashAssetObject, Propertied, Size, Time, TimeRange, Track, TrackObject, VideoInstance, VideoInstanceObject } from '@moviemasher/runtime-shared'
import type { AudioPreview } from './AudioPreview.js'
import type { ClientAsset } from './ClientAsset.js'
import type { SvgOrImageDataOrError } from './ClientEvents.js'
import type { ClientAudioAsset, ClientImageAsset, ClientInstance, ClientVideoAsset, ClientVisibleInstance } from './ClientTypes.js'
import type { EncodingObjects, Encodings } from './Encoding.js'
import type { Panel } from './PanelTypes.js'
import type { Selectable } from './Selectable.js'
import type { Preview, Previews } from './Svg.js'
import type { Action, Actions } from './ActionTypes.js'

export interface ClientMashAsset extends ClientAsset, MashAsset {
  actions: Actions
  addClipToTrack(clip : ClientClip | ClientClips, trackIndex? : number, insertIndex? : number, frame? : number) : void
  addTrack(object?: TrackObject): Track
  buffer: number
  changeTiming(propertied: Propertied, property: string, value : number) : void
  clearPreview(): void
  clipInstance(clipObject: ClipObject): ClientClip
  clips: ClientClips
  clipsInTimeOfType(time: Time, avType?: AVType): ClientClips
  composition: AudioPreview
  destroy(): void
  dispatchChanged(action: Action): void
  draw() : void
  drawnTime? : Time
  encodings: Encodings
  frame: number
  instanceArgs(object?: InstanceObject): InstanceObject & InstanceArgs
  instanceFromObject(object?: InstanceObject): Instance
  loading: boolean
  mashPreviewsPromise(size?: Size, selectedClip?: ClientClip): Promise<Previews>
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
  updateAssetId(oldId: string, newId: string): void
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
  clip: ClientClip
  asset: ClientMashAsset
}

export interface ClientMashAudioInstance extends AudioInstance, ClientInstance {
  asset: ClientMashAudioAsset
  clip: ClientClip
}

export interface ClientMashImageInstance extends ImageInstance, ClientInstance {
  asset: ClientMashImageAsset
  clip: ClientClip
}

export interface ClientMashVideoInstance extends VideoInstance, ClientInstance {
  asset: ClientMashVideoAsset
  clip: ClientClip
}

export interface ClientClip extends Selectable, Clip {
  clipIcon(frameSize: Size, size: Size, scale: number, spacing?: number, color?: string): Promise<SvgOrImageDataOrError>
  clipPreviewPromise(size: Size, time: Time, component: Panel): Promise<Preview>
  container?: ClientVisibleInstance
  content: ClientInstance
  track: ClientTrack
  updateAssetId(oldId: string, newId: string): void
}
export type ClientClips = ClientClip[]

export interface ClientTrack extends Track {
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

export interface ClientMashAssetObject extends MashAssetObject {

  encodings?: EncodingObjects
}