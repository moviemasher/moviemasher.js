import { DataOrError, StringDataOrError, isDefiniteError } from '@moviemasher/runtime-shared'

export const promiseNumbers = (promises: Promise<DataOrError<number>>[]) => {
  const { length } = promises
  const result = { data: 0 }

  switch(length) {
    case 0: return Promise.resolve(result)
    case 1: return promises[0]
  }
  
  const promise = promises.reduce((promise, next) => promise.then(orError => {
    if (isDefiniteError(orError)) return orError

    result.data += orError.data
    return next
  }), Promise.resolve(result))

  return promise.then(orError => {
    if (isDefiniteError(orError)) return orError
    
    return result
  })
}

export const promisesString = (promises: Promise<StringDataOrError>[]): Promise<StringDataOrError> => {
  const result = { data: 'NONE' }
  
  const { length } = promises
  switch(length) {
    case 0: return Promise.resolve(result)
    case 1: return promises[0]
  }

  const promise = promises.reduce((promise, next) => promise.then(orError => {
    if (isDefiniteError(orError)) return orError
    result.data += orError.data

    return next 
  }), Promise.resolve(result))
  return promise.then(orError => {
    if (isDefiniteError(orError)) return orError
    
    return result
  })
}