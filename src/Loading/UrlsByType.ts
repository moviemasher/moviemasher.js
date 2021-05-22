import { LoadTypes } from "../Setup"
import { LoaderFactory } from "../Factory/LoaderFactory"
import { Is } from "../Utilities/Is"
import { Cache } from "./Cache"

class UrlsByType {
  static get none() {
    if (Is.undefined(this.__none)) this.__none = new UrlsByType()
    return this.__none
  }

  constructor() { this.loaders = {} }

  get loaded() { return this.urls.every(url => Cache.cached(url)) }

  get urls() { return LoadTypes.flatMap(type => this[type]) }

  get urlsUnloaded() { return this.urls.filter(url => !Cache.cached(url)) }

  concat(object) {
    if (!Is.instanceOf(object, UrlsByType)) {
      console.warn(this.constructor.name, "concat", object)
      return
    }
    LoadTypes.forEach(type => {
      const urls = this[type]
      urls.splice(0, urls.length, ...new Set([...urls, ...object[type]]))
    })
  }

  load(audioContext = null) {
    const promises = LoadTypes.flatMap(type => {
      const urls = this[type]
      if (urls.length === 0) return []

      if (Is.undefined(this.loaders[type])) {
        const options = { type, audioContext }
        this.loaders[type] = LoaderFactory.createFromObject(options)
      }
      return this.loaders[type].loadUrls(urls)
    })
    if (promises.length) {
      // console.log(this.constructor.name, "load", promises.length)
      return Promise.all(promises)
    }

    // console.log(this.constructor.name, "load resolved")

    return Promise.resolve()
  }
}

const definition = Object.fromEntries(LoadTypes.map(type => [type, {
  get() {
    const key = `__${type}`
    if (Is.undefined(this[key])) this[key] = []
    return this[key]
  }
}]))
Object.defineProperties(UrlsByType.prototype, definition)
export { UrlsByType }
