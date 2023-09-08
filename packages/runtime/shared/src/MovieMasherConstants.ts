import type { StringRecord, StringsRecord } from './Core.js'
import type { EventDispatcher } from './EventDispatcher.js'

import { error, errorCaught, isDefiniteError } from './ErrorFunctions.js'
import { ERROR } from './ErrorName.js'
import { isListenerRecord } from './EventDispatcher.js'
import { isFunction } from './TypeofGuards.js'

export const MovieMasherImportPromise = (imports: StringRecord, eventDispatcher: EventDispatcher) => {
  const functions = Object.keys(imports).sort((a, b) => b.length - a.length)
  const moduleIds = [...new Set(Object.values(imports))]
  const byId: StringsRecord = Object.fromEntries(moduleIds.map(id => (
    [id, functions.filter(key => imports[key] === id)]
  )))
  const promises = moduleIds.map(moduleId => {
    return import(moduleId).then(module => {
      const importers = byId[moduleId]
      const potentialErrors = importers.map(importer => {
        const { [importer]: funktion } = module
        if (!isFunction(funktion)) return error(ERROR.Url, importer)
        
        const listeners = funktion()
        if (!isListenerRecord(listeners)) return error(ERROR.Type, importer)
        
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
      console.error('MovieMasherImportPromise', error)
    })
  })
}
