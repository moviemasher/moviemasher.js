import type { StringRecord, StringsRecord } from './Core.js'
import type { EventDispatcher } from './EventDispatcher.js'

import { namedError, errorCaught, isDefiniteError } from './ErrorFunctions.js'
import { ERROR } from './ErrorName.js'
import { isListenerRecord } from './EventDispatcher.js'
import { isFunction, isPopulatedString } from './TypeofGuards.js'

export const importPromise = (imports: StringRecord, eventDispatcher: EventDispatcher, suffix: string) => {
  const functions = Object.keys(imports).sort((a, b) => b.length - a.length)
  const moduleIds = [...new Set(Object.values(imports).filter(isPopulatedString))]
  const byId: StringsRecord = Object.fromEntries(moduleIds.map(id => (
    [id, functions.filter(key => imports[key] === id)]
  )))
  const promises = moduleIds.map(moduleId => {
    return import(moduleId).then(module => {
      const importers = byId[moduleId]
      const potentialErrors = importers.map(importer => {
        const regex = /^[a-z]+$/
        const key = importer.match(regex) ? `${importer}${suffix}Listeners` : importer
        const { [key]: funktion } = module
        if (!isFunction(funktion)) return namedError(ERROR.Url, importer)
        
        const listeners = funktion()
        if (!isListenerRecord(listeners)) return namedError(ERROR.Type, importer)
        
        eventDispatcher.listenersAdd(listeners)
        return {}
      })
      const definiteErrors = potentialErrors.filter(isDefiniteError)
      if (definiteErrors.length) return definiteErrors[0]
      
      return {}
    }).catch(error => errorCaught(error))
  })
  return Promise.all(promises).then(results => {
    results.filter(isDefiniteError).forEach(error => {
      console.error('importPromise', error)
    })
  })
}
