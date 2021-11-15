
import { Any } from "../declarations"
import { ContextFactory } from "../Playing/ContextFactory"
import { Errors } from "../Setup/Errors"
import { Is } from "../Utilities/Is"

const CacheKeyPrefix = 'cachekey'

class CacheClass {

  add(url : string, value : Any) : void {
    // console.log(this.constructor.name, "add", url, value.constructor.name)
    const key = this.key(url)
    this.cachedByKey.set(key, value)
    this.urlsByKey.set(key, url)
  }

  audibleContext = ContextFactory.audible()

  cached(url: string): boolean {
    const object = this.getObject(url)
    return object && ! (object instanceof Promise)
  }

  caching(url: string): boolean {
    const object = this.getObject(url)
    return object && object instanceof Promise
  }

  private cachedByKey = new Map<string, Any>()

  flush(retainUrls: string[]) {
    const keys = [...this.urlsByKey.keys()]
    const retainKeys = retainUrls.map(url => this.key(url))
    const removeKeys = keys.filter(key => !retainKeys.includes(key))
    removeKeys.forEach(key => {
      const url = this.urlsByKey.get(key)
      if (url) this.remove(url)
    })
  }

  get(url : string) : Any {
    return this.cachedByKey.get(this.key(url))
  }

  getObject(url: string): Any {
     if (!Is.populatedString(url)) throw Errors.argument + 'url'

    const key = this.key(url)
    if (!this.cachedByKey.has(key)) return

     return this.cachedByKey.get(key)
  }

  key(url : string) : string {
    if (!Is.populatedString(url)) throw Errors.argument + 'url'

    return CacheKeyPrefix + url.replaceAll(/[^a-z0-9]/gi, '')
  }

  remove(url : string) : void {
    // console.trace(this.constructor.name, "remove", url)
    const key = this.key(url)
    this.cachedByKey.delete(key)
    this.urlsByKey.delete(key)
  }

  private urlsByKey = new Map<string, string>()

  visibleContext = ContextFactory.visible()
}

const Cache = new CacheClass()
export { Cache }
