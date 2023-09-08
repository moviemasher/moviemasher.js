
import { VideoAsset } from "@moviemasher/runtime-shared"
import { Constrained } from '@moviemasher/runtime-shared'
import { AudibleInstance, VisibleInstance } from '@moviemasher/runtime-shared'
import { VideoInstance } from "@moviemasher/runtime-shared"
import { VIDEO } from '@moviemasher/runtime-shared'

export function VideoInstanceMixin
<T extends Constrained<AudibleInstance & VisibleInstance>>(Base: T): 
T & Constrained<VideoInstance> {
  return class extends Base implements VideoInstance {
    // declare asset: VideoAsset

    type = VIDEO
  }
}
