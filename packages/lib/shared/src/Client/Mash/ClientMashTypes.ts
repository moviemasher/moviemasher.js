import { Propertied, Size, Time, TimeRange } from '@moviemasher/runtime-shared'
import { MashAsset } from '../../Shared/Mash/MashTypes.js'
import { ClientAsset, ClientAudioAsset, ClientImageAsset, ClientVideoAsset } from "../ClientTypes.js"
import { ClientInstance, ClientVisibleInstance } from '../ClientTypes.js'
import { Track, TrackObject } from '../../Shared/Mash/Track/Track.js'
import { Panel } from "../../Base/PanelTypes.js"
import { PreviewItem, PreviewItems, SvgOrImage } from '../../Helpers/Svg/Svg.js'
import { Masher } from '../../Plugin/Masher/Masher.js'
import { AudioPreview } from '../../Plugin/Masher/Preview/AudioPreview/AudioPreview.js'
import { AVType } from '../../Setup/AVType.js'
import { Selectable } from '../../Plugin/Masher/Selectable.js'
import { Clip } from '../../Shared/Mash/Clip/Clip.js'
import { ClientEffects } from '../../Effect/Effect.js'
import { ClientAssetManager } from '../Asset/AssetManager/ClientAssetManager.js'
import { AudioInstance, AudioInstanceObject } from '../../Shared/Audio/AudioInstance.js'
import { Instance, InstanceArgs, InstanceObject } from '../../Shared/Instance/Instance.js'
import { ImageInstance, ImageInstanceObject } from '../../Shared/Image/ImageInstance.js'
import { VideoInstance, VideoInstanceObject } from '../../Shared/Video/VideoInstance.js'

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
  effects: ClientEffects
  asset: ClientMashAsset
}


export interface ClientMashAudioInstance extends AudioInstance, ClientInstance {
  asset: ClientMashAudioAsset
  effects: ClientEffects
}

export interface ClientMashImageInstance extends ImageInstance, ClientInstance {
  asset: ClientMashImageAsset
  effects: ClientEffects
}

export interface ClientMashVideoInstance extends VideoInstance, ClientInstance {
  asset: ClientMashVideoAsset
  effects: ClientEffects
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
