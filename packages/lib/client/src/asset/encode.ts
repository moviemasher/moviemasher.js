import type { ClientMashAsset, EventDoServerActionDetail, ServerProgress } from '@moviemasher/runtime-client'

import { isEncoding } from '@moviemasher/lib-shared/utility/guards.js'
import { EventChangeScalar, EventChangedClientAction, EventChangedMashAsset, EventChangedServerAction, EventClientEncode, EventDoServerAction, EventEnabledServerAction, EventMashAsset, EventProgress, MOVIEMASHER, SAVE, VIEW } from '@moviemasher/runtime-client'
import { ENCODE, ERROR, EncodeArgs, EncodeOptions, IMAGE, ListenersFunction, POST, VIDEO, VOID_FUNCTION, idIsTemporary, isDefiniteError, namedError } from '@moviemasher/runtime-shared'
import { requestCallbackPromise } from '../utility/request.js'

export class EncodeHandler {
  constructor() {
    const mashEvent = new EventMashAsset()
    MOVIEMASHER.eventDispatcher.dispatch(mashEvent)
    this.mashAsset = mashEvent.detail.mashAsset
    this.saveEnabledUpdated()
    // console.debug('EncodeHandler constructor', this.saveEnabled, this.encodeEnabled)
  }

  private dispatchEnabledIfChanged(func: VoidFunction): void {
    const { encodeEnabled } = this
    func()
    // console.debug('EncodeHandler dispatchEnabledIfChanged', encodeEnabled, this.encodeEnabled)
    if (encodeEnabled === this.encodeEnabled) return

    const event = new EventChangedServerAction(ENCODE)
    MOVIEMASHER.eventDispatcher.dispatch(event)
  }

  private doServerAction(detail: EventDoServerActionDetail): void {
    const { mashAsset } = this
    if (!mashAsset) return

    const { id } = detail
    const { type, assetObject } = mashAsset
    const options: EncodeOptions = {}
    switch (type) { 
      case IMAGE:
      case VIDEO: {
        const { size } = mashAsset
        options.width = size.width
        options.height = size.height
        break
      }
    }
    const progress = EncodeHandler.progress(id)
    // console.log('EncodeHandler doServerAction', id, type, options)
    const encodeEvent = new EventClientEncode(assetObject, type, options, progress)
    MOVIEMASHER.eventDispatcher.dispatch(encodeEvent)
    const { promise: encodePromise } = encodeEvent.detail
    if (!encodePromise) return

    detail.promise = encodePromise.then(orError => {
      progress?.done()
      if (isDefiniteError(orError)) return 

      const { data: encodingObject } = orError
      const { id: encodingId } = encodingObject
      mashAsset.encodings.push(encodingObject)
      MOVIEMASHER.eventDispatcher.dispatch(new EventChangeScalar('mash.encoding', encodingId))
      MOVIEMASHER.eventDispatcher.dispatch(new EventChangedClientAction(VIEW))

      const saveEvent = new EventDoServerAction(SAVE, SAVE)
      MOVIEMASHER.eventDispatcher.dispatch(saveEvent)
      const { promise: savePromise } = saveEvent.detail
      if (!savePromise) return 
      
      return savePromise.then(VOID_FUNCTION)
    })
  }

  private get encodeEnabled(): boolean {
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
    const saveEvent = new EventEnabledServerAction(SAVE)
    MOVIEMASHER.eventDispatcher.dispatch(saveEvent)
    this.saveEnabled = !!saveEvent.detail.enabled
    // console.debug('EncodeHandler saveEnabledUpdated', this.saveEnabled)
  }

  static handleChangedMashAsset(event: EventChangedMashAsset): void {
    // console.debug('EncodeHandler handleChangedMashAsset')
    EncodeHandler.instance.mashAsset = event.detail
  }

  static handleChangedServerAction(event: EventChangedServerAction): void {
    const { detail: serverAction } = event
    if (serverAction !== SAVE) return

    // console.debug('EncodeHandler handleChangedServerAction')
    EncodeHandler.instance.saveEnabledUpdated()
  }

  static handleDoServerAction(event: EventDoServerAction): void {
    const { detail } = event
    if (detail.serverAction !== ENCODE) return

    // console.debug('EncodeHandler handleChangedServerAction')
    EncodeHandler.instance.doServerAction(detail)
  }

  static handleEnabledServerAction (event: EventEnabledServerAction): void {
    const { detail } = event
    const { serverAction } = detail
    if (serverAction !== ENCODE) return

    event.stopImmediatePropagation()
    detail.enabled = EncodeHandler.instance.encodeEnabled
    // console.debug('EncodeHandler handleEnabledServerAction', detail.enabled)
  }

  static handleEncode(event: EventClientEncode): void {
    event.stopImmediatePropagation()
    const { detail } = event
    const { progress, encodingType = VIDEO, encodeOptions = {}, mashAssetObject } = detail

    progress?.do(1)
    const jsonRequest = {
      endpoint: 'encode/start', init: { method: POST }
    }
    const args: EncodeArgs = {
      encodingType, encodeOptions, mashAssetObject
    }
    detail.promise = requestCallbackPromise(jsonRequest, progress, args).then(orError => {
      if (isDefiniteError(orError)) return orError
      progress?.did(1)

      const { data } = orError
      if (!isEncoding(data)) return namedError(ERROR.Internal)

      return { data }
    })
  }

  private static instance = new EncodeHandler()

  private static progress(id?: string): ServerProgress | undefined {
    if (!id) return 

    let total = 2
    let current = 1
    const dispatch = () => {
      MOVIEMASHER.eventDispatcher.dispatch(new EventProgress(id, current / total))
    }
    return {
      do: (steps: number) => { 
        total += steps
        // console.log('EncodeHandler progress do', steps, current, total)
        dispatch()
      },
      did: (steps: number) => { 
        current += steps
        // console.log('EncodeHandler progress did', steps, current, total)
        dispatch()
       },
       done: () => {
        current = total
        dispatch()
       },
    }
  }
}

// listen for client encode related events
export const encodeClientListeners: ListenersFunction = () => ({
  [EventClientEncode.Type]: EncodeHandler.handleEncode,
  [EventEnabledServerAction.Type]: EncodeHandler.handleEnabledServerAction,
  [EventChangedServerAction.Type]: EncodeHandler.handleChangedServerAction,
  [EventDoServerAction.Type]: EncodeHandler.handleDoServerAction,
  [EventChangedMashAsset.Type]: EncodeHandler.handleChangedMashAsset,
})

