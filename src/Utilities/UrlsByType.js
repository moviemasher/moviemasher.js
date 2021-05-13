import { LoadTypes } from "../Types"
import { LoaderFactory } from "../Factory/LoaderFactory"
import { Is } from "../Is"
import { Cache } from "../Cache"

class UrlsByType {
  static get none() { return UrlsByTypeNone }

  constructor() { this.loaders = {} }

  get loaded() { return this.urls.every(url => Cache.cached(url)) }

  get urls() { return LoadTypes.flatMap(type => this[type]) }

  get urlsUnloaded() { return this.urls.filter(url => !Cache.cached(url)) }

  concat(object) {
    LoadTypes.forEach(type => {
      const urls = this[type]
      urls.splice(0, urls.length, ...new Set([...urls, ...object[type]]))
    })
  }

  load(audioContext) {
    const promises = LoadTypes.flatMap(type => {
      const urls = this[type]
      if (urls.length === 0) return []

      if (Is.undefined(this.loaders[type])) {
        const options = { type: type, audioContext: audioContext }
        this.loaders[type] = LoaderFactory.createFromObject(options)
      }
      return this.loaders[type].loadUrls(urls)
    })
    return Promise.all(promises)
  }

}

const definition = Object.fromEntries(LoadTypes.map(type => [type, {
  get: function() { 
    const key = `__${type}`
    if (Is.undefined(this[key])) this[key] = [] 
    return this[key]
  }
}]))
Object.defineProperties(UrlsByType.prototype, definition)
const UrlsByTypeNone = new UrlsByType
export { UrlsByType }