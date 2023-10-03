import type { ClientAssets, ServerProgress } from '@moviemasher/runtime-client'

import { EmptyFunction, assertDefined, assertString } from '@moviemasher/lib-shared'
import { EventChangedServerAction, EventDoServerAction, EventEnabledServerAction, EventProgress, EventSavableManagedAsset, EventSavableManagedAssets, EventSave, MovieMasher, ServerActionSave } from '@moviemasher/runtime-client'
import { isDefiniteError } from '@moviemasher/runtime-shared'
import { requestJsonRecordPromise, requestPopulate } from '../utility/request.js'

export class SaveHandler {
  private static get enabled(): boolean {
    if (SaveHandler.saving) return false
  
    const event = new EventSavableManagedAsset()
    MovieMasher.eventDispatcher.dispatch(event)
    return event.detail.savable
  }

  private static progress(id?: string): ServerProgress | undefined {
    if (!id) return 

    let total = 2
    let current = 1
    const dispatch = () => {
      MovieMasher.eventDispatcher.dispatch(new EventProgress(id, current / total))
    }
    return {
      do: (steps: number) => { 
        total += steps
        console.log('SaveHandler progress do', steps, current, total)
        dispatch()
       },
      did: (steps: number) => { 
        current += steps
        console.log('SaveHandler progress did', steps, current, total)
        dispatch()
       },
       done: () => {
        current = total
        dispatch()
       },
    }
  }

  static handleDoServerAction(doEvent: EventDoServerAction) {
    const { detail } = doEvent
    if (detail.serverAction !== ServerActionSave) return 
    
    const assets: ClientAssets = []
    MovieMasher.eventDispatcher.dispatch(new EventSavableManagedAssets(assets))
    
    const { length } = assets
    if (length) {
      doEvent.stopImmediatePropagation()
      console.debug('SaveHandler handleAction', detail, length)
   
      SaveHandler.saving = true
      const firstAsset = assets.shift()
      assertDefined(firstAsset) 
      const progress = SaveHandler.progress(detail.id)

      let promise = firstAsset.savePromise(progress)
      progress?.do(length - 1)
      assets.forEach((asset, index) =>  {
        promise = promise.then(orError => {
          progress?.did(1)
          console.debug('SaveHandler handleAction', index, isDefiniteError(orError))

          return isDefiniteError(orError) ? orError : asset.savePromise(progress)
        })
      })
      promise = promise.then(orError => {
        SaveHandler.saving = false  
        if (isDefiniteError(orError)) {
          console.error('SaveHandler handleAction', detail, orError)
        }
        progress?.done()
        return orError
      })
      detail.promise = promise.then(EmptyFunction)
    }
  }

  static handleEnabledServerAction(enabledEvent: EventEnabledServerAction) {
    const { detail } = enabledEvent
    const { serverAction } = detail
    if (serverAction !== ServerActionSave) return 
  
    enabledEvent.stopImmediatePropagation()
    detail.enabled = SaveHandler.enabled
  }

  static handleSave(event: EventSave): void {
    console.log(EventSave.Type, 'handled', event.detail)
    event.stopImmediatePropagation()

    const { detail } = event
    const { asset } = detail

    const request = {
      endpoint: '/asset/put', init: { method: 'POST' }
    }
    const { assetObject } = asset
    const putRequest = requestPopulate(request, { assetObject })
    
    console.log(EventSave.Type, JSON.stringify(putRequest, null, 2))

    detail.promise = requestJsonRecordPromise(putRequest).then(orError => {
      if (isDefiniteError(orError)) return orError

      const { data } = orError
      const { id: newId = '' } = data
      assertString(newId)
      return { data: newId }
    })
  }

  private static _saving = false 
  private static get saving() { return SaveHandler._saving }
  private static set saving(value) {
    if (SaveHandler._saving !== value) {
      SaveHandler._saving = value
      MovieMasher.eventDispatcher.dispatch(new EventChangedServerAction(ServerActionSave))
    }
  }
}

MovieMasher.eventDispatcher.addDispatchListener(
  EventSave.Type, SaveHandler.handleSave
)

// listen for server action enabled event
MovieMasher.eventDispatcher.addDispatchListener(
  EventEnabledServerAction.Type, SaveHandler.handleEnabledServerAction
)

// listen for server do action event
MovieMasher.eventDispatcher.addDispatchListener(
  EventDoServerAction.Type, SaveHandler.handleDoServerAction
)
