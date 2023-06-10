import type { StartOptions } from '../../Plugin/Masher/Preview/AudioPreview/AudioPreview.js';
import type { TimeRange } from '@moviemasher/runtime-shared';
import type { Constrained } from '@moviemasher/runtime-shared';
import type { AudibleInstance } from '../../Shared/Instance/Instance.js';
import type { ClientAudibleInstance, ClientInstance } from '../ClientTypes.js';
import type { ClientAudibleAsset } from '../Asset/ClientAsset.js';



export function AudibleClientInstanceMixin<T extends Constrained<ClientInstance & AudibleInstance>>(Base: T):
  T & Constrained<ClientAudibleInstance> {
  return class extends Base implements ClientAudibleInstance {
    declare asset: ClientAudibleAsset;

    startOptions(seconds: number, timeRange: TimeRange): StartOptions {
      let offset = timeRange.withFrame(this.startTrim).seconds;
      let start = timeRange.seconds - seconds;
      let duration = timeRange.lengthSeconds;

      if (start < 0) {
        offset -= start;
        duration += start;
        start = 0;
      }
      return { start, offset, duration };
    }
  };
}
