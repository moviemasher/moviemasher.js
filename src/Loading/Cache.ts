import { Any } from "../Setup/declarations"
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

  cached(url : string) : boolean {
    if (!Is.populatedString(url)) throw Errors.argument + 'url'

    return this.cachedByKey.has(this.key(url))
  }

  private cachedByKey = new Map<string, Any>()

  get(url : string) : Any | undefined {
    return this.cachedByKey.get(this.key(url))
  }

  key(url : string) : string {
    if (!Is.populatedString(url)) throw Errors.argument + 'url'

    return CacheKeyPrefix + url.replaceAll(/[^a-z0-9]/gi, '')
  }

  remove(url : string) : void {
    // console.log(this.constructor.name, "remove", url)
    const key = this.key(url)
    this.cachedByKey.delete(key)
    this.urlsByKey.delete(key)
  }

  private urlsByKey = new Map<string, string>()
}

const Cache = new CacheClass()
export { Cache }
