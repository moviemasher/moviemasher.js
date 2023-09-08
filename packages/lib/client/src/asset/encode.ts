import type { ClientMashAsset, EventDoServerActionDetail } from '@moviemasher/runtime-client'

import { idIsTemporary } from '@moviemasher/lib-shared'
import { EventChangedMashAsset, EventChangedServerAction, EventDoServerAction, EventEnabledServerAction, EventMashAsset, MovieMasher, ServerActionEncode, ServerActionSave } from '@moviemasher/runtime-client'
import { requestJsonRecordPromise, requestPopulate } from '../utility'

export class EncodeHandler {
  constructor() {
    const mashEvent = new EventMashAsset()
    MovieMasher.eventDispatcher.dispatch(mashEvent)
    this.mashAsset = mashEvent.detail.mashAsset
    this.saveEnabledUpdated()
    // console.debug('EncodeHandler constructor', this.saveEnabled, this.encodeEnabled)
  }

  private dispatchEnabledIfChanged(func: VoidFunction): void {
    const { encodeEnabled } = this
    func()
    // console.debug('EncodeHandler dispatchEnabledIfChanged', encodeEnabled, this.encodeEnabled)
    if (encodeEnabled === this.encodeEnabled) return

    const event = new EventChangedServerAction(ServerActionEncode)
    MovieMasher.eventDispatcher.dispatch(event)
  }

  private encode(detail: EventDoServerActionDetail): void {
    const { mashAsset } = this
    if (!mashAsset) return

    const { id: progress} = detail
    const { id } = mashAsset
    console.log('EncodeHandler encode', id, progress)


    const request = {
      endpoint: '/rendering/encode', init: { method: 'POST' }
    }

    const populated = requestPopulate(request, mashAsset.assetObject)
    detail.promise = requestJsonRecordPromise(populated).then((response) => {
      console.log(response)

    })
  }

  private get encodeEnabled(): boolean {
    if (this.saveEnabled) {
      console.debug('EncodeHandler encodeEnabled saveEnabled')
      return false
    }
    const { mashAsset } = this
    if (!mashAsset) {
      console.debug('EncodeHandler encodeEnabled !mashAsset')
      return false
    }

    const temporary = idIsTemporary(mashAsset.id)
    if (temporary) {
      console.debug('EncodeHandler encodeEnabled temporary')
    }
    return !temporary
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
    const saveEvent = new EventEnabledServerAction(ServerActionSave)
    MovieMasher.eventDispatcher.dispatch(saveEvent)
    this.saveEnabled = !!saveEvent.detail.enabled
    // console.debug('EncodeHandler saveEnabledUpdated', this.saveEnabled)
  }

  static handleChangedMashAsset(event: EventChangedMashAsset): void {
    // console.debug('EncodeHandler handleChangedMashAsset')
    EncodeHandler.instance.mashAsset = event.detail
  }

  static handleChangedServerAction(event: EventChangedServerAction): void {
    const { detail: serverAction } = event
    if (serverAction !== ServerActionSave) return

    // console.debug('EncodeHandler handleChangedServerAction')
    EncodeHandler.instance.saveEnabledUpdated()
  }
  static handleDoServerAction(event: EventDoServerAction): void {
    const { detail } = event
    if (detail.serverAction !== ServerActionEncode) return

    // console.debug('EncodeHandler handleChangedServerAction')
    EncodeHandler.instance.encode(detail)
  }

  static handleEnabledServerAction (event: EventEnabledServerAction): void {
    const { detail } = event
    const { serverAction } = detail
    if (serverAction !== ServerActionEncode) return

    event.stopImmediatePropagation()
    detail.enabled = EncodeHandler.instance.encodeEnabled
    // console.debug('EncodeHandler handleEnabledServerAction', detail.enabled)
  }

  private static instance = new EncodeHandler()
}

// console.debug('EncodeHandler ADDING LISTENERS')
MovieMasher.eventDispatcher.addDispatchListener(EventEnabledServerAction.Type, EncodeHandler.handleEnabledServerAction)
MovieMasher.eventDispatcher.addDispatchListener(EventChangedServerAction.Type, EncodeHandler.handleChangedServerAction)
MovieMasher.eventDispatcher.addDispatchListener(EventDoServerAction.Type, EncodeHandler.handleDoServerAction)
MovieMasher.eventDispatcher.addDispatchListener(EventChangedMashAsset.Type, EncodeHandler.handleChangedMashAsset)
