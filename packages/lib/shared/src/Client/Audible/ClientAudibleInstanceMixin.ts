import type { StartOptions } from '@moviemasher/runtime-client';
import type { TimeRange } from '@moviemasher/runtime-shared';
import type { Constrained } from '@moviemasher/runtime-shared';
import type { AudibleInstance } from '@moviemasher/runtime-shared';
import type { ClientAudibleInstance, ClientInstance } from '@moviemasher/runtime-client';
import type { ClientAudibleAsset } from '@moviemasher/runtime-client';



export function ClientAudibleInstanceMixin<T extends Constrained<ClientInstance & AudibleInstance>>(Base: T):
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
