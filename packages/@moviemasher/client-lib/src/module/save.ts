import type { Asset, ClientAssets, JobOptions, ListenersFunction, SaveFunction, StringDataOrError } from '@moviemasher/shared-lib/types.js'

import { assertDefined } from '@moviemasher/shared-lib/utility/guards.js'
import { EventChangedServerAction, EventDoServerAction, EventEnabledServerAction, EventSavableManagedAsset, EventSavableManagedAssets, newProgress } from './event.js'
import { MOVIE_MASHER, $ENCODE, $POST, VOID_FUNCTION, isDefiniteError, namedError, ERROR, $SAVE } from '@moviemasher/shared-lib/runtime.js'
import { requestJsonRecordPromise } from '../utility/request.js'
import { isString } from '@moviemasher/shared-lib/utility/guard.js'

export class SaveHandler {
  private static get enabled(): boolean {
    if (SaveHandler.saving) return false
  
    const event = new EventSavableManagedAsset()
    MOVIE_MASHER.dispatchCustom(event)
    return event.detail.savable
  }

  static handleDoServerAction(doEvent: EventDoServerAction) {
    const { detail } = doEvent
    if (detail.serverAction !== $SAVE) return 
    
    const assets: ClientAssets = []
    MOVIE_MASHER.dispatchCustom(new EventSavableManagedAssets(assets))
    
    const { length } = assets
    if (length) {
      doEvent.stopImmediatePropagation()
      SaveHandler.saving = true
      const firstAsset = assets.shift()
      assertDefined(firstAsset) 
      const progress = newProgress(detail.id)
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
    console.log('SaveHandler.handleEnabledServerAction', serverAction)

    if (serverAction !== $SAVE) return 
  
    enabledEvent.stopImmediatePropagation()
    detail.enabled = SaveHandler.enabled
  }

  static save(asset: Asset, _options: JobOptions = {}): Promise<StringDataOrError> {
    const request = { endpoint: '/asset/put', init: { method: $POST } }
    const { assetObject } = asset
    return requestJsonRecordPromise(request, { assetObject }).then(orError => {
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
      MOVIE_MASHER.dispatchCustom(new EventChangedServerAction($SAVE))
      MOVIE_MASHER.dispatchCustom(new EventChangedServerAction($ENCODE))
    }
  }
}


export const audioSaveFunction: SaveFunction = (args, jobOptions) => {
  assertDefined(args)

  return SaveHandler.save(args, jobOptions)
}
export const imageSaveFunction: SaveFunction = (args, jobOptions) => {
  assertDefined(args)
  return SaveHandler.save(args, jobOptions)
}
export const videoSaveFunction: SaveFunction = (args, jobOptions) => {
  assertDefined(args)
  return SaveHandler.save(args, jobOptions)
}

// listen for client save related events
export const saveClientListeners: ListenersFunction = () => ({
  [EventEnabledServerAction.Type]: SaveHandler.handleEnabledServerAction,
  [EventDoServerAction.Type]: SaveHandler.handleDoServerAction,
})

