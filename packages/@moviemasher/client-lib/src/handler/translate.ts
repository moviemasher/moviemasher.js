import type { ListenersFunction } from '@moviemasher/shared-lib/types.js'

import { EventTranslate } from '../module/event.js'

export class TranslateHandler {
  static handle(event: EventTranslate): void {
    const { detail } = event
    const { id } = detail
    const data = [id.slice(0, 1).toUpperCase(), id.slice(1)].join('')
    detail.promise = Promise.resolve({ data })
    event.stopImmediatePropagation()
  }
}
// listen for client transcode event
export const translateClientListeners: ListenersFunction = () => ({
  [EventTranslate.Type]: TranslateHandler.handle
})
