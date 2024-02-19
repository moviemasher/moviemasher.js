import type { AudibleAsset, AudibleInstance, Constrained, VideoAsset, VideoInstance, VisibleAsset, VisibleInstance } from '../types.js'

import { $VIDEO } from '../runtime.js'

export function VideoAssetMixin<T extends Constrained<AudibleAsset & VisibleAsset>>(Base: T):
  T & Constrained<VideoAsset> {
  return class extends Base implements VideoAsset {
    override canBeContainer = true
    override canBeContent = true
    override hasIntrinsicSizing = true
    override type = $VIDEO
  }
}

export function VideoInstanceMixin<T extends Constrained<AudibleInstance & VisibleInstance>>(Base: T):
  T & Constrained<VideoInstance> {
  return class extends Base implements VideoInstance {
    declare asset: VideoAsset
    type = $VIDEO
  }
}
