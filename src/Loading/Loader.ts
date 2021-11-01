import { Any, LoadPromise } from "../declarations"
import { Cache } from "./Cache"

class Loader  {
  async loadUrl(url : string) : LoadPromise {
    if (Cache.cached(url)) {
      const promiseOrCached = Cache.get(url)
      if (promiseOrCached instanceof Promise) return promiseOrCached
      return Promise.resolve()
    }

    const promise = this.requestUrl(url)
    Cache.add(url, promise)
    const processed = await promise
    Cache.add(url, processed)
    return processed
  }

  requestUrl(_url : string) : Promise<Any> { return Promise.resolve() }
}

export { Loader }
