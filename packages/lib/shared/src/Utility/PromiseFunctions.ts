import { DataOrError, isDefiniteError } from '@moviemasher/runtime-shared'

export const promiseNumbers = (promises: Promise<DataOrError<number>>[]) => {
  const { length } = promises
  const resolved = Promise.resolve({ data: 0 })
  switch(length) {
    case 0: return resolved
    case 1: return promises[0]
  }
  let data = 0
  const promise = promises.reduce((promise, next) => promise.then(orError => {
    if (isDefiniteError(orError)) return orError

    data += orError.data
    return next
  }), resolved)

  return promise.then(orError => {
    if (isDefiniteError(orError)) return orError
    
    return { data }
  })
}