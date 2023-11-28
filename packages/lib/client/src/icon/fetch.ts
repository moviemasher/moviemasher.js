import type { Icon } from '@moviemasher/runtime-client'
import type { DataOrError, ListenersFunction, StringRecord } from '@moviemasher/runtime-shared'

import { isStringRecord } from '@moviemasher/lib-shared/utility/guards.js'
import { EventIcon, MOVIEMASHER } from '@moviemasher/runtime-client'
import { isDefiniteError } from '@moviemasher/runtime-shared'
import { requestJsonRecordPromise } from '../utility/request.js'

export class FetchIconHandler {
  static json?: StringRecord
  static _jsonPromise?: Promise<DataOrError<StringRecord>>
  static get jsonPromise(): Promise<DataOrError<StringRecord>> {
    if (FetchIconHandler.json) return Promise.resolve({ data: FetchIconHandler.json })

    const { _jsonPromise } = FetchIconHandler
    if (_jsonPromise) return _jsonPromise

    const { icons } = MOVIEMASHER.options
    if (!icons) return this._jsonPromise = Promise.resolve({ data: {} })
    
    if (isStringRecord(icons)) {
      return this._jsonPromise = Promise.resolve({ data: icons })
    }
 
    return this._jsonPromise = requestJsonRecordPromise(icons).then(orError => {
      if (isDefiniteError(orError)) return orError 

      const iconStringRecord = orError.data as StringRecord
      delete this._jsonPromise
      FetchIconHandler.json = iconStringRecord 
      return { data: iconStringRecord }
    })
  }

  static handle(event: EventIcon): void {
    const { detail } = event
    const { id } = detail
    if (id) detail.promise = FetchIconHandler.jsonPromise.then(orError => {
      if (isDefiniteError(orError)) return orError 

      const { data: iconStringRecord } = orError      
      const icon: Icon = {}
      const string = String(iconStringRecord[id])
      if (string) {
        if (string[0] === '<') icon.svgString = string 
        else icon.imgUrl = string 
      }
      return { data: icon }
    })
    event.stopPropagation()
  }
}

export const ClientIconListeners: ListenersFunction = () => ({
  [EventIcon.Type]: FetchIconHandler.handle,
})
