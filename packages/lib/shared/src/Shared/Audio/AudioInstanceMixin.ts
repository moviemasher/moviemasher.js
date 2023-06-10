import { AudioAsset } from './AudioAsset.js';
import { Constrained } from '@moviemasher/runtime-shared';
import { AudibleInstance } from '../Instance/Instance.js';
import { AudioInstance } from './AudioInstance.js';

export function AudioInstanceMixin
<T extends Constrained<AudibleInstance>>(Base: T): 
T & Constrained<AudioInstance> {
  return class extends Base implements AudioInstance {
    declare asset: AudioAsset
  }
}
