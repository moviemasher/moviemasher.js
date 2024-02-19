import type { ClientAssets } from '../types.js'
import type { ListenersFunction, ServerProgress } from '@moviemasher/shared-lib/types.js'

import { assertDefined } from '@moviemasher/shared-lib/utility/guards.js'
import { SAVE } from '../runtime.js'
import { EventChangedServerAction, EventDoServerAction, EventEnabledServerAction, EventProgress, EventSavableManagedAsset, EventSavableManagedAssets, EventSave } from '../utility/events.js'
import { MOVIEMASHER, $ENCODE, $POST, VOID_FUNCTION, isDefiniteError, namedError, ERROR } from '@moviemasher/shared-lib/runtime.js'
import { requestJsonRecordPromise } from '../utility/request.js'
import { isString } from '@moviemasher/shared-lib/utility/guard.js'

export class SaveHandler {
  private static get enabled(): boolean {
    if (SaveHandler.saving) return false
  
    const event = new EventSavableManagedAsset()
    MOVIEMASHER.dispatch(event)
    return event.detail.savable
  }

  private static progress(id?: string): ServerProgress | undefined {
    if (!id) return 

    let total = 2
    let current = 1
    const dispatch = () => {
      MOVIEMASHER.dispatch(new EventProgress(id, current / total))
    }
    return {
      do: (steps: number) => { 
        total += steps
        // console.log('SaveHandler progress do', steps, current, total)
        dispatch()
       },
      did: (steps: number) => { 
        current += steps
        // console.log('SaveHandler progress did', steps, current, total)
        dispatch()
       },
       done: () => {
        // console.log('SaveHandler progress done', total)
        current = total
        dispatch()
       },
    }
  }

  static handleDoServerAction(doEvent: EventDoServerAction) {
    const { detail } = doEvent
    if (detail.serverAction !== SAVE) return 
    
    const assets: ClientAssets = []
    MOVIEMASHER.dispatch(new EventSavableManagedAssets(assets))
    
    const { length } = assets
    if (length) {
      doEvent.stopImmediatePropagation()
      SaveHandler.saving = true
      const firstAsset = assets.shift()
      assertDefined(firstAsset) 
      const progress = SaveHandler.progress(detail.id)
      let promise = firstAsset.savePromise(progress)
      progress?.do(length - 1)
      assets.forEach(asset =>  {
        promise = promise.then(orError => {
          progress?.did(1)
          return isDefiniteError(orError) ? orError : asset.savePromise(progress)
        })
      })
      promise = promise.then(orError => {
        SaveHandler.saving = false
        progress?.done()
        return orError
      })
      detail.promise = promise.then(VOID_FUNCTION)
    }
  }

  static handleEnabledServerAction(enabledEvent: EventEnabledServerAction) {
    const { detail } = enabledEvent
    const { serverAction } = detail
    if (serverAction !== SAVE) return 
  
    enabledEvent.stopImmediatePropagation()
    detail.enabled = SaveHandler.enabled
  }

  static handleSave(event: EventSave): void {
    event.stopImmediatePropagation()
    const { detail } = event
    const { asset } = detail
    const request = { endpoint: '/asset/put', init: { method: $POST } }
    const { assetObject } = asset
    detail.promise = requestJsonRecordPromise(request, { assetObject }).then(orError => {
      if (isDefiniteError(orError)) return orError

      const { data } = orError
      const { id: newId = '' } = data
      if (!isString(newId)) return namedError(ERROR.AssetId)

      return { data: newId }
    })
  }

  private static _saving = false 
  private static get saving() { return SaveHandler._saving }
  private static set saving(value) {
    if (SaveHandler._saving !== value) {
      SaveHandler._saving = value
      MOVIEMASHER.dispatch(new EventChangedServerAction(SAVE))
      MOVIEMASHER.dispatch(new EventChangedServerAction($ENCODE))
    }
  }
}

// listen for client save related events
export const saveClientListeners: ListenersFunction = () => ({
  [EventSave.Type]: SaveHandler.handleSave,
  [EventEnabledServerAction.Type]: SaveHandler.handleEnabledServerAction,
  [EventDoServerAction.Type]: SaveHandler.handleDoServerAction,
})
