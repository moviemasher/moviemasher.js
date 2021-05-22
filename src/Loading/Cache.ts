import { Errors } from "../Setup/Errors"
import { Is } from "../Utilities/Is"

class Cache {
  constructor() {
    this.__cached_urls = {}
    this.__urls_by_md5 = {}
  }

  add(url, value){
    const key = this.key(url)
    // console.log("Cache.add", url, key)
    this.__cached_urls[key] = value
    this.__urls_by_md5[key] = url
  }

  cached(url) { return !!this.get(url) }

  get(url) { 
    const key = this.key(url)
    // console.log("Cache.get", url, key)
    return this.__cached_urls[key] 
  }

  key(url) {
    if(!(Is.string(url) && !Is.empty(url))) throw Errors.url + url
    return url
  }

  remove(url) {
    const key = this.key(url)
    // console.log("Cache.get", url, key)
    delete this.__cached_urls[key]
    delete this.__urls_by_md5[key]
  }
  urls() { return Object.values(this.__urls_by_md5) }
}

const CacheInstance = new Cache
export { CacheInstance as Cache }