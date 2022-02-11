
import { LoadPromise } from ".."
import { Any, Endpoint, GraphFile } from "../declarations"
import { LoaderFactory } from "../Loader/LoaderFactory"
import { GraphType, LoadType } from "../Setup/Enums"
import { Errors } from "../Setup/Errors"
import { isPopulatedString } from "../Utility/Is"
import { urlForEndpoint } from "../Utility/Url"
import { Preloader } from "./Preloader"

const CacheKeyPrefix = 'cachekey'

class PreloaderClass implements Preloader {
  constructor(endpoint?: Endpoint) {
    this.endpoint = endpoint || {}
  }

  add(url : string, value : Any): void {
    const key = this.urlKey(url)
    this.cacheByKey.set(key, value)
    this.cacheUrlsByKey.set(key, url)
  }

  private cacheByKey = new Map<string, Any>()

  private cacheUrlsByKey = new Map<string, string>()

  private cached(url: string): boolean {
    const object = this.getObject(url)
    return object && ! (object instanceof Promise)
  }

  private caching(url: string): boolean {
    const object = this.getObject(url)
    return object && object instanceof Promise
  }

  private fileUrl(graphFile: GraphFile): string {
    const { file } = graphFile
    const url = urlForEndpoint(this.endpoint, file)
    return url
  }

  flush(retainUrls: string[]): void {
    const keys = [...this.cacheUrlsByKey.keys()]
    const retainKeys = retainUrls.map(url => this.urlKey(url))
    const removeKeys = keys.filter(key => !retainKeys.includes(key))
    removeKeys.forEach(key => {
      const url = this.cacheUrlsByKey.get(key)
      if (url) this.remove(url)
    })
  }

  getFile(graphFile: GraphFile): Any {
    const url = this.fileUrl(graphFile)
    return this.getObject(url)
  }

  private getObject(url: string): Any {
      if (!isPopulatedString(url)) throw Errors.argument + 'url'

    const key = this.urlKey(url)
    if (!this.cacheByKey.has(key)) return

    return this.cacheByKey.get(key)
  }

  graphType = GraphType.Canvas

  loadFilePromise(graphFile: GraphFile): Promise<GraphFile> {
    if (this.loadedFile(graphFile)) return Promise.resolve(graphFile)
    if (this.loadingFile(graphFile)) return this.loadingFilePromise(graphFile).then(() => graphFile)

    const { type } = graphFile
    const url = this.fileUrl(graphFile)
    const loadType = type as LoadType
    const loader = LoaderFactory[loadType](this)
    return loader.loadFilePromise({ ...graphFile, file: url })
  }

  loadFilesPromise(files: GraphFile[]): Promise<GraphFile[]> {
    return Promise.all(files.map(file => this.loadFilePromise(file)))
  }

  loadedFile(graphFile: GraphFile): boolean {
    return this.cached(this.fileUrl(graphFile))
  }

  loadingFile(graphFile: GraphFile): boolean {
    return this.caching(this.fileUrl(graphFile))
  }

  loadingFilePromise(graphFile: GraphFile): LoadPromise {
    if (this.loadedFile(graphFile)) return Promise.resolve()

    if (!this.loadingFile(graphFile)) throw Errors.internal + 'loadingFilePromise'

    return this.getObject(this.fileUrl(graphFile))
  }

  key(graphFile: GraphFile): string {
    const url = this.fileUrl(graphFile)
    return this.urlKey(url)
  }

  urlKey(url: string): string {
    if (!isPopulatedString(url)) throw Errors.argument + 'url'

    return CacheKeyPrefix + url.replaceAll(/[^a-z0-9]/gi, '')
  }

  remove(url : string): void {
    const key = this.urlKey(url)
    this.cacheByKey.delete(key)
    this.cacheUrlsByKey.delete(key)
  }

  endpoint: Endpoint = {}
}

export { PreloaderClass }
