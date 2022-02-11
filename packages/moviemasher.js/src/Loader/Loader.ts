import { AudibleContextInstance } from "../Context/AudibleContext"
import { Any, GraphFile, LoadPromise } from "../declarations"
import { PreloaderClass } from "../Preloader/PreloaderClass"
import { LoadType } from "../Setup/Enums"

class Loader {
  constructor(preloader: PreloaderClass) {
    this.preloader = preloader
  }

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
    return AudibleContextInstance.decode(arrayBuffer)
  }

  loadFilePromise(graphFile: GraphFile): Promise<GraphFile> {
    const url = graphFile.file
    return this.loadUrlPromise(url).then(() => graphFile)
  }

  async loadUrlPromise(url: string): LoadPromise {
    const graphFile = { type: this.type, file: url }
    if (this.preloader.loadedFile(graphFile)) {
      const promiseOrCached = this.preloader.getFile(graphFile)
      if (promiseOrCached instanceof Promise) return promiseOrCached
      return Promise.resolve()
    }

    const promise = this.requestUrl(url)
    this.preloader.add(url, promise)
    const processed = await promise
    this.preloader.add(url, processed)
    return processed
  }

  preloader: PreloaderClass

  protected requestUrl(_url : string) : Promise<Any> { return Promise.resolve() }

  type!: LoadType
}

export { Loader }
