import type { AudibleAsset, AudibleInstance, Constrained, DataOrError, ContentFill, PropertySize, Rect, Time, VideoAsset, VideoInstance, VisibleAsset, VisibleInstance } from '../types.js'

import { ERROR, VIDEO, namedError } from '../runtime.js'

export function VideoAssetMixin<T extends Constrained<AudibleAsset & VisibleAsset>>(Base: T):
  T & Constrained<VideoAsset> {
  return class extends Base implements VideoAsset {

    canBeContainer = true
    canBeContent = true

    type = VIDEO
  }
}

export function VideoInstanceMixin<T extends Constrained<AudibleInstance & VisibleInstance>>(Base: T):
  T & Constrained<VideoInstance> {
  return class extends Base implements VideoInstance {
    declare asset: VideoAsset
    type = VIDEO
  }
}
