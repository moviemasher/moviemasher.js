import { Instance, InstanceObject, InstanceArgs } from './InstanceTypes.js'
import { VideoAsset } from './VideoAsset.js'

export interface VideoInstance extends Instance {
  asset: VideoAsset
}

export interface VideoInstanceObject extends InstanceObject { }

export interface VideoInstanceArgs extends InstanceArgs, VideoInstanceObject {
  asset: VideoAsset
}