
import { Any } from "../declarations"
import { ContextFactory } from "../Context/ContextFactory"
import { Errors } from "../Setup/Errors"
import { Is } from "../Utilities/Is"

const CacheKeyPrefix = 'cachekey'

const cacheAudibleContext = ContextFactory.audible()
const cacheByKey = new Map<string, Any>()
const cacheUrlsByKey = new Map<string, string>()

const cacheAdd = (url : string, value : Any) : void => {
  const key = cacheKey(url)
  cacheByKey.set(key, value)
  cacheUrlsByKey.set(key, url)
}


const cacheCached = (url: string): boolean => {
  const object = cacheGetObject(url)
  return object && ! (object instanceof Promise)
}

const cacheCaching = (url: string): boolean => {
  const object = cacheGetObject(url)
  return object && object instanceof Promise
}


const cacheFlush = (retainUrls: string[]): void => {
  const keys = [...cacheUrlsByKey.keys()]
  const retainKeys = retainUrls.map(url => cacheKey(url))
  const removeKeys = keys.filter(key => !retainKeys.includes(key))
  removeKeys.forEach(key => {
    const url = cacheUrlsByKey.get(key)
    if (url) cacheRemove(url)
  })
}

const cacheGet = (url : string) : Any => {
  return cacheByKey.get(cacheKey(url))
}

const cacheGetObject = (url: string): Any => {
    if (!Is.populatedString(url)) throw Errors.argument + 'url'

  const key = cacheKey(url)
  if (!cacheByKey.has(key)) return

    return cacheByKey.get(key)
}

const cacheKey = (url : string) : string => {
  if (!Is.populatedString(url)) throw Errors.argument + 'url'

  return CacheKeyPrefix + url.replaceAll(/[^a-z0-9]/gi, '')
}

const cacheRemove = (url : string) : void => {
  const key = cacheKey(url)
  cacheByKey.delete(key)
  cacheUrlsByKey.delete(key)
}


const Cache = {
  add: cacheAdd,
  audibleContext: cacheAudibleContext,
  cached: cacheCached,
  caching: cacheCaching,
  flush: cacheFlush,
  get: cacheGet,
  getObject: cacheGetObject,
  key: cacheKey,
  remove: cacheRemove,
}

export {
  Cache,
  cacheAdd,
  cacheAudibleContext,
  cacheCached,
  cacheCaching,
  cacheFlush,
  cacheGet,
  cacheGetObject,
  cacheKey,
  cacheRemove,
}
