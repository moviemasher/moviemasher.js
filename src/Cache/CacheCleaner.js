import { Masher } from "../Masher"
import { Cache } from "./Cache"

const INTERVAL_TICS = 10 * 1000

class CacheCleaner {
  constructor() {
    this.interval = setInterval(this.handleInterval.bind(this), INTERVAL_TICS)
  }
  handleInterval() {
    const urls_in_use = new Set
    
    Masher.instances.forEach(masher => {
      const urls = masher.urlsInUse
      // console.log("CacheCleaner.handleInterval urls:", urls)
      urls.forEach(url => urls_in_use.add(url))
    })
    const urls_in_cache = [...new Set(Cache.urls())]
    const remove_urls = urls_in_cache.filter(url => !urls_in_use.has(url))
    remove_urls.forEach(url => Cache.remove(url))
    // const count = remove_urls.length
    // if (count) console.log(`CacheCleaner.handleInterval urls removed: ${count}`)
  }
}

const CacheCleanerInstance = new CacheCleaner
export { CacheCleanerInstance as CacheCleaner }