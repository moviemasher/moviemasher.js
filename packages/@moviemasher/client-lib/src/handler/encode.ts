import type { ClientMashAsset } from '../types.js'
import type { EncodeArgs, ServerProgress, EncodeOptions, ListenersFunction } from '@moviemasher/shared-lib/types.js'

import { isEncoding } from '@moviemasher/shared-lib/utility/guards.js'
import { SAVE, VIEW } from '../runtime.js'
import { EventChangeScalar, EventChangedClientAction, EventChangedMashAsset, EventChangedServerAction, EventDoServerAction, EventEnabledServerAction, EventMashAsset, EventProgress } from '../utility/events.js'
import { EventDoServerActionDetail } from '../types.js'
import { MOVIEMASHER, $ENCODE, $IMAGE, $VIDEO, VOID_FUNCTION, idIsTemporary, isDefiniteError } from '@moviemasher/shared-lib/runtime.js'

export class EncodeHandler {
  constructor() {
    const mashEvent = new EventMashAsset()
    MOVIEMASHER.dispatch(mashEvent)
    this.mashAsset = mashEvent.detail.mashAsset
    this.saveEnabledUpdated()
    // console.debug('EncodeHandler constructor', this.saveEnabled, this.encodeEnabled)
  }

  private dispatchEnabledIfChanged(func: VoidFunction): void {
    const { encodeEnabled } = this
    func()
    // console.debug('EncodeHandler dispatchEnabledIfChanged', encodeEnabled, this.encodeEnabled)
    if (encodeEnabled === this.encodeEnabled) return

    const event = new EventChangedServerAction($ENCODE)
    MOVIEMASHER.dispatch(event)
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
    const progress = EncodeHandler.progress(id)
    // console.log('EncodeHandler doServerAction', id, type, options)
    // const encodeEvent = new EventClientEncode(assetObject, type, options, progress)
    // MOVIEMASHER.dispatch(encodeEvent)
    // const { promise: encodePromise } = encodeEvent.detail
    // if (!encodePromise) return
    const encodeArgs: EncodeArgs = {
      type, options, asset: assetObject
    }
    const encodePromise = MOVIEMASHER.promise($ENCODE, encodeArgs, { progress })

    detail.promise = encodePromise.then(orError => {
      progress?.done()
      if (isDefiniteError(orError)) return 

      const { data: encodingObject } = orError
      if (!isEncoding(encodingObject)) return //namedError(ERROR.Syntax, $ENCODE)


      const { id: encodingId } = encodingObject
      mashAsset.encodings.push(encodingObject)
      MOVIEMASHER.dispatch(new EventChangeScalar('mash.encoding', encodingId))

      MOVIEMASHER.dispatch(new EventChangedClientAction(VIEW))

      const saveEvent = new EventDoServerAction(SAVE, SAVE)
      MOVIEMASHER.dispatch(saveEvent)
      const { promise: savePromise } = saveEvent.detail
      if (!savePromise) return //orError
      
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
    MOVIEMASHER.dispatch(saveEvent)
    this.saveEnabled = !!saveEvent.detail.enabled
    // console.debug('EncodeHandler saveEnabledUpdated', this.saveEnabled)
  }

  static handleChangedMashAsset(event: EventChangedMashAsset): void {
    // console.debug('EncodeHandler handleChangedMashAsset')
    EncodeHandler.instance.mashAsset = event.detail
  }

  static handleChangedServerAction(event: EventChangedServerAction): void {
    const { detail: serverAction } = event
    // console.debug('EncodeHandler handleChangedServerAction', serverAction)
    if (serverAction !== SAVE) return

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
    detail.enabled = EncodeHandler.instance.encodeEnabled
  }

  // static handleEncode(event: EventClientEncode): void {
  //   event.stopImmediatePropagation()
  //   const { detail } = event
  //   const { progress, type = $VIDEO, options = {}, asset } = detail

  //   progress?.do(1)
  //   const jsonRequest = {
  //     endpoint: 'encode/start', init: { method: $POST }
  //   }
  //   const args: EncodeArgs = { type, options, asset }
  //   detail.promise = requestCallbackPromise(jsonRequest, progress, args).then(orError => {
  //     if (isDefiniteError(orError)) return orError
  //     progress?.did(1)

  //     const { data } = orError
  //     if (!isEncoding(data)) return namedError(ERROR.Internal)

  //     return { data }
  //   })
  // }

  private static instance = new EncodeHandler()

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
  // [EventClientEncode.Type]: EncodeHandler.handleEncode,
  [EventEnabledServerAction.Type]: EncodeHandler.handleEnabledServerAction,
  [EventChangedServerAction.Type]: EncodeHandler.handleChangedServerAction,
  [EventDoServerAction.Type]: EncodeHandler.handleDoServerAction,
  [EventChangedMashAsset.Type]: EncodeHandler.handleChangedMashAsset,
})

