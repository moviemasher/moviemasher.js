import { Constrained } from '@moviemasher/runtime-shared'
import { VisibleAsset } from '@moviemasher/runtime-shared'
import { ClientVisibleAsset } from '@moviemasher/runtime-client'
import { ClientAsset } from "@moviemasher/runtime-client"

export function ClientVisibleAssetMixin
<T extends Constrained<ClientAsset & VisibleAsset>>(Base: T):
T & Constrained<ClientVisibleAsset>  {
  return class extends Base implements ClientVisibleAsset {}
}
