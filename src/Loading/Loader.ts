import { Any, LoadPromise } from "../declarations"
import { Cache } from "./Cache"

class Loader {
  arrayBufferPromiseFromUrl(url: string): Promise<ArrayBuffer> {
    return fetch(url).then(response => response.arrayBuffer())
  }

  arrayBufferPromiseFromBlob(blob: Blob):Promise<ArrayBuffer> {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => { resolve(<ArrayBuffer> reader.result) }
      reader.onerror = reject
      reader.readAsArrayBuffer(blob)
    })
  }

  audioBufferPromiseFromArrayBuffer(arrayBuffer: ArrayBuffer): Promise<AudioBuffer> {
    return Cache.audibleContext.decode(arrayBuffer)
  }

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
