import type { Icon } from '@moviemasher/runtime-client'
import type { DataOrError, StringRecord } from '@moviemasher/runtime-shared'

import { EventIcon, MovieMasher } from '@moviemasher/runtime-client'
import { isDefiniteError } from '@moviemasher/runtime-shared'
import { requestJsonRecordPromise, requestPopulate } from '../utility/request.js'

export class FetchIconHandler {
  static json?: StringRecord
  static _jsonPromise?: Promise<DataOrError<StringRecord>>
  static get jsonPromise(): Promise<DataOrError<StringRecord>> {
    if (FetchIconHandler.json) return Promise.resolve({ data: FetchIconHandler.json })

    const { _jsonPromise } = FetchIconHandler
    if (_jsonPromise) return _jsonPromise

    const { iconOptions = { request: { endpoint: '' } } } = MovieMasher.options
    const { request } = iconOptions

    const populated = requestPopulate(request)
    return this._jsonPromise = requestJsonRecordPromise(populated).then(orError => {
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

MovieMasher.eventDispatcher.addDispatchListener(EventIcon.Type, FetchIconHandler.handle)
