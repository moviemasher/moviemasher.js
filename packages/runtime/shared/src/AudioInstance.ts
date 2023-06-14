import type { AudioAsset } from './AudioAsset.js'
import type { Instance, InstanceObject, InstanceArgs } from './Instance.js'

export interface AudioInstance extends Instance {
  asset: AudioAsset
}

export interface AudioInstanceObject extends InstanceObject { }

export interface AudioInstanceArgs extends InstanceArgs, AudioInstanceObject {
  asset: AudioAsset
}
