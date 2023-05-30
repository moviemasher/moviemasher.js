
import { VideoAsset } from "./VideoAsset.js"
import { Constrained } from '../../Base/Constrained.js'
import { AudibleInstance, VisibleInstance } from '../Instance/Instance.js'
import { VideoInstance } from "./VideoInstance.js"
import { TypeVideo } from '@moviemasher/runtime-shared'

export function VideoInstanceMixin
<T extends Constrained<AudibleInstance & VisibleInstance>>(Base: T): 
T & Constrained<VideoInstance> {
  return class extends Base implements VideoInstance {
    // declare asset: VideoAsset

    type = TypeVideo
  }
}
