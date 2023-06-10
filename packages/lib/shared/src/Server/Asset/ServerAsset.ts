import type { GraphFiles, ServerPromiseArgs } from '../GraphFile.js'
import type { PreloadArgs } from "../../Base/CacheTypes.js"
import type { Asset, VisibleAsset, AudibleAsset } from '../../Shared/Asset/AssetTypes.js'
import type { AudioAsset } from '../../Shared/Audio/AudioAsset.js'
import type { ImageAsset } from '../../Shared/Image/ImageAsset.js'
import { InstanceArgs } from '../../Shared/Instance/Instance.js'
import { ImageInstance, ImageInstanceObject } from '../../Shared/Image/ImageInstance.js'
import { AudioInstance, AudioInstanceObject } from '../../Shared/Audio/AudioInstance.js'
import { VideoInstance, VideoInstanceObject } from '../../Shared/Video/VideoInstance.js'
import { VideoAsset } from '../../Shared/Video/VideoAsset.js'

export interface ServerAsset extends Asset {
  graphFiles(args: PreloadArgs): GraphFiles
  serverPromise(args: ServerPromiseArgs): Promise<void>
}

export type ServerAssets = ServerAsset[]

export interface ServerAudioAsset extends AudioAsset, ServerAudibleAsset {
  instanceFromObject(object: AudioInstanceObject): AudioInstance
  instanceArgs(object?: AudioInstanceObject): AudioInstanceObject & InstanceArgs
}
export interface ServerImageAsset extends ImageAsset, ServerVisibleAsset {
  instanceFromObject(object: ImageInstanceObject): ImageInstance
  instanceArgs(object?: ImageInstanceObject): ImageInstanceObject & InstanceArgs
 }
export interface ServerVideoAsset extends VideoAsset, ServerAudibleAsset, ServerVisibleAsset {
  instanceFromObject(object: VideoInstanceObject): VideoInstance
  instanceArgs(object?: VideoInstanceObject): VideoInstanceObject & InstanceArgs
}


export interface ServerAudibleAsset extends ServerAsset, AudibleAsset {}

export interface ServerVisibleAsset extends ServerAsset, VisibleAsset {}