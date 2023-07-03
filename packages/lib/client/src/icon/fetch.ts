import type { Icon } from '@moviemasher/runtime-client'
import type { IconEvent } from '../declarations'
import type { DataOrError, StringRecord } from '@moviemasher/runtime-shared'

import { EventTypeIconFromId, MovieMasher } from '@moviemasher/runtime-client'
import { ErrorName, error, isDefiniteError } from '@moviemasher/runtime-shared'
import { isStringRecord } from '@moviemasher/lib-shared'
import { requestJsonRecordPromise, requestPopulate } from '../utility/request.js'

class Handler {
  static json?: StringRecord
  static _jsonPromise?: Promise<DataOrError<StringRecord>>
  static get jsonPromise(): Promise<DataOrError<StringRecord>> {
    if (Handler.json) return Promise.resolve({ data: Handler.json })

    const { _jsonPromise } = Handler

    if (_jsonPromise) return _jsonPromise

    const { iconOptions = { request: {} } } = MovieMasher.options
    const { request = {}} = iconOptions
    request.endpoint ||= (new URL('../../json/icons.json', import.meta.url)).href

    const populated = requestPopulate(request)
    console.log('Handler.jsonPromise', populated)
    return this._jsonPromise = requestJsonRecordPromise(populated).then(orError => {
      if (isDefiniteError(orError)) return orError 

      const { data: iconStringRecord } = orError
      if (!isStringRecord(iconStringRecord)) return error(ErrorName.Url)
      
      delete this._jsonPromise
      Handler.json = iconStringRecord
      return { data: iconStringRecord }
    })
  }

  static handle(event: IconEvent): void {
    const { detail } = event
    const { id } = detail
    if (id) detail.promise = Handler.jsonPromise.then(orError => {
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
MovieMasher.eventDispatcher.addDispatchListener(EventTypeIconFromId, Handler.handle)

export {}