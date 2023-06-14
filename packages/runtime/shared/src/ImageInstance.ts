import { ImageAsset } from './ImageAsset.js'
import { Instance, InstanceObject, InstanceArgs } from './Instance.js'

export interface ImageInstance extends Instance {
  asset: ImageAsset
}

export interface ImageInstanceObject extends InstanceObject { }

export interface ImageInstanceArgs extends InstanceArgs, ImageInstanceObject {
  asset: ImageAsset
}
