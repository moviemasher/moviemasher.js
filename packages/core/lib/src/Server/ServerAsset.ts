import type { Source, Constructor } from '@moviemasher/runtime-shared'
import type { GraphFiles, PreloadArgs, ServerPromiseArgs } from '../Base/Code.js'
import type { Asset, VisibleAsset, AudibleAsset } from '../Shared/Asset/Asset.js'
import type { AudioAsset, AudioAssetObject } from '../Shared/Audio/AudioAsset.js'
import type { ImageAsset, ImageAssetObject } from '../Shared/Image/ImageAsset.js'
import { InstanceArgs } from '../Shared/Instance/Instance.js'
import { ImageInstance, ImageInstanceObject } from '../Shared/Image/ImageInstance.js'
import { AudioInstance, AudioInstanceObject } from '../Shared/Audio/AudioInstance.js'
import { VideoInstance, VideoInstanceObject } from '../Shared/Video/VideoInstance.js'
import { VideoAsset, VideoAssetObject } from '../Shared/Video/VideoAsset.js'

export interface ServerAsset extends Asset {
  graphFiles(args: PreloadArgs): GraphFiles
  serverPromise(args: ServerPromiseArgs): Promise<void>

  
}

export type ServerAssets = ServerAsset[]

export interface AudioServerAsset extends AudioAsset, AudibleServerAsset {
  instanceFromObject(object: AudioInstanceObject): AudioInstance
  instanceArgs(object?: AudioInstanceObject): AudioInstanceObject & InstanceArgs
}
export interface ImageServerAsset extends ImageAsset, VisibleServerAsset {
  instanceFromObject(object: ImageInstanceObject): ImageInstance
  instanceArgs(object?: ImageInstanceObject): ImageInstanceObject & InstanceArgs
 }
export interface VideoServerAsset extends VideoAsset, AudibleServerAsset, VisibleServerAsset {
  instanceFromObject(object: VideoInstanceObject): VideoInstance
  instanceArgs(object?: VideoInstanceObject): VideoInstanceObject & InstanceArgs
}
export type AudioServerBySource = Record<Source, Constructor<AudioServerAsset, AudioAssetObject>>
export type ImageServerBySource = Record<Source, Constructor<ImageServerAsset, ImageAssetObject>>
export type VideoServerBySource = Record<Source, Constructor<VideoServerAsset, VideoAssetObject>>

export interface AudibleServerAssetProperties extends AudibleAsset {}
export interface VisibleServerAssetProperties extends VisibleAsset {}

export interface AudibleServerAsset extends ServerAsset, AudibleAsset {}

export interface VisibleServerAsset extends ServerAsset, VisibleAsset {}