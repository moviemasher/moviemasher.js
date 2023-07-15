import type { MashAssetObject } from '@moviemasher/runtime-shared'
import type { AssetObjectPromiseEvent } from '../../declarations'

import { MovieMasher, EventTypeAssetObject } from '@moviemasher/runtime-client'


MovieMasher.eventDispatcher.addDispatchListener(EventTypeAssetObject, (event: AssetObjectPromiseEvent) => {
  const { detail } = event
  const id = `temporary-${crypto.randomUUID()}`

  const data: MashAssetObject = {
     id,
      color: '#FFFFFF',
      type: 'video',
      source: 'mash',
  }
  detail.promise = Promise.resolve({ data })
  event.stopImmediatePropagation()
})

export {}