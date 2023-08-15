import type { ClientAudibleAsset, ClientAudibleInstance, ClientInstance, StartOptions } from '@moviemasher/runtime-client'
import type { AudibleInstance, Constrained, TimeRange } from '@moviemasher/runtime-shared'

export function ClientAudibleInstanceMixin<T extends Constrained<ClientInstance & AudibleInstance>>(Base: T):
  T & Constrained<ClientAudibleInstance> {
  return class extends Base implements ClientAudibleInstance {
    declare asset: ClientAudibleAsset

    startOptions(seconds: number, timeRange: TimeRange): StartOptions {
      let offset = timeRange.withFrame(this.startTrim).seconds
      let start = timeRange.seconds - seconds
      let duration = timeRange.lengthSeconds

      if (start < 0) {
        offset -= start
        duration += start
        start = 0
      }
      return { start, offset, duration }
    }
  }
}
