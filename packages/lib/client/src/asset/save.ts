import { idGenerate } from '@moviemasher/lib-shared'
import { EventSave, MovieMasher } from '@moviemasher/runtime-client'

MovieMasher.eventDispatcher.addDispatchListener(EventSave.Type, (event: EventSave) => {
  event.stopImmediatePropagation()

  const { detail } = event
  const { assetObject } = detail
  // if (isRawAssetObject(assetObject)) return
  // const { request } = assetObject


  console.log(EventSave.Type, JSON.stringify(assetObject, null, 2))

  detail.promise = Promise.resolve({ data: idGenerate('PERM')})
})

export {}