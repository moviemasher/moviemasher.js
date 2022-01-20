import { Any, LoadPromise } from "../declarations"
import { cacheAdd, cacheAudibleContext, cacheCached, cacheGet } from "./Cache"

class Loader {
  protected arrayBufferPromiseFromUrl(url: string): Promise<ArrayBuffer> {
    return fetch(url).then(response => response.arrayBuffer())
  }

  protected arrayBufferPromiseFromBlob(blob: Blob):Promise<ArrayBuffer> {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => { resolve(<ArrayBuffer> reader.result) }
      reader.onerror = reject
      reader.readAsArrayBuffer(blob)
    })
  }

  protected audioBufferPromiseFromArrayBuffer(arrayBuffer: ArrayBuffer): Promise<AudioBuffer> {
    return cacheAudibleContext.decode(arrayBuffer)
  }

  async loadUrl(url : string) : LoadPromise {
    if (cacheCached(url)) {
      const promiseOrCached = cacheGet(url)
      if (promiseOrCached instanceof Promise) return promiseOrCached
      return Promise.resolve()
    }

    const promise = this.requestUrl(url)
    cacheAdd(url, promise)
    const processed = await promise
    cacheAdd(url, processed)
    return processed
  }

  protected requestUrl(_url : string) : Promise<Any> { return Promise.resolve() }
}

export { Loader }
