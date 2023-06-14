import { AudioAsset } from '@moviemasher/runtime-shared';
import { Constrained } from '@moviemasher/runtime-shared';
import { AudibleInstance } from '@moviemasher/runtime-shared';
import { AudioInstance } from '@moviemasher/runtime-shared';

export function AudioInstanceMixin
<T extends Constrained<AudibleInstance>>(Base: T): 
T & Constrained<AudioInstance> {
  return class extends Base implements AudioInstance {
    declare asset: AudioAsset
  }
}
