import type { DataOrError, Encoding, ListenersFunction } from '@moviemasher/shared-lib/types.js'

import { ERROR, isDefiniteError, namedError } from '@moviemasher/shared-lib/runtime.js'
import { isDate } from '@moviemasher/shared-lib/utility/guard.js'
import { isEncoding } from '@moviemasher/shared-lib/utility/guards.js'
import { EventServerEncodeStatus } from '../utility/events.js'
import { $ENCODING, jobGetStatus } from "../utility/job.js"

const statusPromise = async (id: string): Promise<DataOrError<Encoding | Date>> => {
  const orError = await jobGetStatus(id)
  if (isDefiniteError(orError)) return orError

  const { data } = orError
  if (isDate(data) || isEncoding(data)) return { data }

  return namedError(ERROR.Syntax, { ...data, name: $ENCODING })
}
const statusHandler = (event: EventServerEncodeStatus) => {
  const { detail } = event
  const { id } = detail
  detail.promise = statusPromise(id)
  event.stopImmediatePropagation()
}

export const ServerEncodeStatusListeners: ListenersFunction = () => ({
  [EventServerEncodeStatus.Type]: statusHandler,
})
