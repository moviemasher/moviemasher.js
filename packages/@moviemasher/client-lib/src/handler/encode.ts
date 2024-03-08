import type { ClientMashAsset, EncodeArgs, EncodeOptions, ListenersFunction } from '@moviemasher/shared-lib/types.js'

import { isEncoding } from '@moviemasher/shared-lib/utility/guards.js'
import { EventChangedClientAction, EventChangedMashAsset, EventChangedServerAction, EventDoServerAction, EventEnabledServerAction, EventMashAsset, newProgress } from '../module/event.js'
import { EventDoServerActionDetail } from '../utility/event-types.js'
import { $VIEW, MOVIE_MASHER, $ENCODE, $IMAGE, $VIDEO, VOID_FUNCTION, idIsTemporary, isDefiniteError, $SAVE } from '@moviemasher/shared-lib/runtime.js'

export class EncodeHandler {
  constructor() {
    const mashEvent = new EventMashAsset()
    MOVIE_MASHER.dispatchCustom(mashEvent)
    this.mashAsset = mashEvent.detail.mashAsset
    this.saveEnabledUpdated()
    // console.debug('EncodeHandler constructor', this.saveEnabled, this.encodeEnabled)
  }

  private dispatchEnabledIfChanged(func: VoidFunction): void {
    const { enabled: encodeEnabled } = this
    func()
    // console.debug('EncodeHandler dispatchEnabledIfChanged', encodeEnabled, this.encodeEnabled)
    if (encodeEnabled === this.enabled) return

    const event = new EventChangedServerAction($ENCODE)
    MOVIE_MASHER.dispatchCustom(event)
  }

  private doServerAction(detail: EventDoServerActionDetail): void {
    const { mashAsset } = this
    if (!mashAsset) return

    const { id } = detail
    const { type, assetObject } = mashAsset
    const options: EncodeOptions = {}
    switch (type) { 
      case $IMAGE:
      case $VIDEO: {
        const { size } = mashAsset
        options.width = size.width // 4
        options.height = size.height // 4
        break
      }
    }
    const progress = newProgress(id)

    const encodeArgs: EncodeArgs = {
      type, options, asset: assetObject
    }
    const encodePromise = MOVIE_MASHER.promise(encodeArgs, $ENCODE, { progress })

    detail.promise = encodePromise.then(orError => {
      progress?.done()
      if (isDefiniteError(orError)) return 

      const { data: encodingObject } = orError
      if (!isEncoding(encodingObject)) return 

      mashAsset.resources.unshift(encodingObject)
      MOVIE_MASHER.dispatchCustom(new EventChangedClientAction($VIEW))
      const saveEvent = new EventDoServerAction($SAVE, $SAVE)
      MOVIE_MASHER.dispatchCustom(saveEvent)
      const { promise: savePromise } = saveEvent.detail
      if (!savePromise) return 
      
      return savePromise.then(VOID_FUNCTION)
    })
  }

  private get enabled(): boolean {
    if (this.saveEnabled) return false
    
    const { mashAsset } = this
    if (!mashAsset) return false
    
    return !idIsTemporary(mashAsset.id)
  }

  private _mashAsset?: ClientMashAsset
  private get mashAsset(): ClientMashAsset | undefined { return this._mashAsset }
  private set mashAsset(value: ClientMashAsset | undefined) {
    // console.debug('EncodeHandler mashAsset', this._mashAsset === value, !!value)
    if (this._mashAsset === value) return

    this.dispatchEnabledIfChanged(() => { this._mashAsset = value })
  }

  private _saveEnabled = false
  private get saveEnabled(): boolean { return this._saveEnabled }
  private set saveEnabled(value: boolean) {
    if (this._saveEnabled === value) return

    this.dispatchEnabledIfChanged(() => { this._saveEnabled = value })
  }

  private saveEnabledUpdated() {
    const saveEvent = new EventEnabledServerAction($SAVE)
    MOVIE_MASHER.dispatchCustom(saveEvent)
    this.saveEnabled = !!saveEvent.detail.enabled
    console.debug('EncodeHandler saveEnabledUpdated', this.saveEnabled)
  }

  static handleChangedMashAsset(event: EventChangedMashAsset): void {
    // console.debug('EncodeHandler handleChangedMashAsset', !!event.detail)
    EncodeHandler.instance.mashAsset = event.detail
  }

  static handleChangedServerAction(event: EventChangedServerAction): void {
    const { detail: serverAction } = event
    console.debug('EncodeHandler handleChangedServerAction', serverAction)
    if (serverAction !== $SAVE) return

    EncodeHandler.instance.saveEnabledUpdated()
  }

  static handleDoServerAction(event: EventDoServerAction): void {
    const { detail } = event
    if (detail.serverAction !== $ENCODE) return

    // console.debug('EncodeHandler handleChangedServerAction')
    EncodeHandler.instance.doServerAction(detail)
  }

  static handleEnabledServerAction (event: EventEnabledServerAction): void {
    const { detail } = event
    const { serverAction } = detail
    if (serverAction !== $ENCODE) return

    event.stopImmediatePropagation()
    detail.enabled = EncodeHandler.instance.enabled
    console.log('EncodeHandler.handleEnabledServerAction', detail.enabled)
  }

  private static instance = new EncodeHandler()
}

// listen for client encode related events
export const encodeClientListeners: ListenersFunction = () => ({
  // [EventClientEncode.Type]: EncodeHandler.handleEncode,
  [EventEnabledServerAction.Type]: EncodeHandler.handleEnabledServerAction,
  [EventChangedServerAction.Type]: EncodeHandler.handleChangedServerAction,
  [EventDoServerAction.Type]: EncodeHandler.handleDoServerAction,
  [EventChangedMashAsset.Type]: EncodeHandler.handleChangedMashAsset,
})
