import type { ClientAsset, ClientVisibleAsset } from '@moviemasher/runtime-client'
import type { Constrained, Size, VisibleAsset } from '@moviemasher/runtime-shared'

export function ClientVisibleAssetMixin
<T extends Constrained<ClientAsset & VisibleAsset>>(Base: T):
T & Constrained<ClientVisibleAsset>  {
  return class extends Base implements ClientVisibleAsset {
    get previewSize(): Size | undefined {
      return this.sourceSize
    }
  }
}
