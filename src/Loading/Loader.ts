import { Base } from "../Base"
import { Cache } from "./Cache"

class Loader extends Base {
  constructor(object) {
    super(object)
    // console.log("Loader", this.object)
    this.promises = {}
  }

  get type() { return this.object.type }

  loadedUrl(url) { return Cache.cached(url) }

  loadedUrls(urls) { return urls.every(url => this.loadedUrl(url)) }

  loadUrl(url) {
    if (this.promises[url]) return this.promises[url]
    if (Cache.cached(url)) return Promise.resolve(Cache.get(url))

    const promise = this.requestUrl(url)
    this.promises[url] = promise
    return promise.then(processed => {
      // console.log(this.constructor.name, "loadUrl", processed.constructor.name)
      Cache.add(url, processed)
      delete this.promises[url]
      return processed
    })
  }

  loadUrls(urls) {
    return Promise.all(urls.map(url => this.loadUrl(url)))
  }
}

export { Loader }
