import type { DataOrError, ListenersFunction, StringRecord } from '@moviemasher/shared-lib/types.js'

import { MOVIE_MASHER } from '@moviemasher/shared-lib/runtime.js'
import { EventIcon } from '../utility/events.js'
import { IconResponse } from '../types.js'
import { isDefiniteError } from '@moviemasher/shared-lib/runtime.js'
import { requestJsonRecordPromise } from '../utility/request.js'
import { isObject, isString } from '@moviemasher/shared-lib/utility/guard.js'


const isStringRecord = (value: any): value is StringRecord => {
  return isObject(value) && Object.values(value).every(value => isString(value))
}

export class FetchIconHandler {
  static json?: StringRecord
  static _jsonPromise?: Promise<DataOrError<StringRecord>>
  static get jsonPromise(): Promise<DataOrError<StringRecord>> {
    if (FetchIconHandler.json) return Promise.resolve({ data: FetchIconHandler.json })

    const { _jsonPromise } = FetchIconHandler
    if (_jsonPromise) return _jsonPromise

    const { icons } = MOVIE_MASHER.options
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
      const icon: IconResponse = {}
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

export const iconClientListeners: ListenersFunction = () => ({
  [EventIcon.Type]: FetchIconHandler.handle,
})
