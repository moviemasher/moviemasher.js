
import { Endpoint, LoadedImage, LoadedVideo } from "../declarations"

import { GraphFile, GraphFiles } from "../MoveMe"
import { Errors } from "../Setup/Errors"
import { assertLoaderType, Loaded, LoadedImageOrVideo, LoadedInfo, Loader, LoaderCache, LoaderFile, LoaderFiles, LoaderPath } from "./Loader"
import { Definition, isDefinition } from "../Definition/Definition"
import { assertObject, assertPopulatedString, isAboveZero, isPopulatedObject, isString } from "../Utility/Is"
import { isUpdatableSizeDefinition, UpdatableSizeDefinition } from "../Mixin/UpdatableSize/UpdatableSize"
import { isUpdatableDurationDefinition, UpdatableDurationDefinition } from "../Mixin/UpdatableDuration/UpdatableDuration"
import { FontDefinition, isFontDefinition } from "../Media/Font/Font"
import { Size, sizeAboveZero, sizesEqual } from "../Utility/Size"
import { EmptyMethod } from "../Setup/Constants"
import { GraphFileType, LoadType } from "../Setup/Enums"
import { urlOptionsObject, urlsAbsolute } from "../Utility/Url"
import { arrayLast } from "../Utility/Array"

export class LoaderClass implements Loader {
  constructor(endpoint?: Endpoint) {
    this.endpoint = endpoint || {}
  }

  protected absoluteUrl(path: string): string { return path }

  protected browsing = true
  
  protected cacheGet(graphFile: GraphFile, createIfNeeded?: boolean): LoaderCache | undefined {
    const key = this.key(graphFile)
    const cacheKey = this.cacheKey(graphFile)
    const found = this.loaderCache.get(cacheKey)
    if (found ||!createIfNeeded) return found

    const { definition, type } = graphFile
    const definitions: Definition[] = []
    if (isDefinition(definition)) definitions.push(definition)
    const cache: LoaderCache = { loaded: false, definitions }
    this.cacheSet(cacheKey, cache)
    cache.promise = this.cachePromise(key, graphFile, cache).then(loaded => {
      cache.loaded = true
      cache.result = loaded
      return loaded
    }).catch(error => {
      // console.log(this.constructor.name, "cacheGet.cachePromise", error, error.constructor.name)
      cache.error = error
      cache.loaded = true
      return error
    })
    return cache
  }

  private cacheKey(graphFile: GraphFile): string {
    const { type } = graphFile
    const key = this.key(graphFile)
    return`${type}:/${key}`
  }

  protected cachePromise(key: string, graphFile: GraphFile, cache: LoaderCache): Promise<Loaded> {
    const cacheKey = this.cacheKey(graphFile)
    const loaderFile: LoaderFile = {
      loaderPath: cacheKey, urlOrLoaderPath: key, loaderType: graphFile.type
    }
    return this.filePromise(loaderFile)
  }

  private cacheSet(graphFile: GraphFile | string, cache: LoaderCache) {
    const key = isString(graphFile) ? graphFile: this.cacheKey(graphFile) 
    this.loaderCache.set(key, cache)
  }

  endpoint: Endpoint

  protected filePromise(file: LoaderFile): Promise<Loaded> {
    throw Errors.unimplemented + 'filePromise'
  }
  
  flushFilesExcept(fileUrls: GraphFiles = []): void {
    const retainKeys = fileUrls.map(fileUrl => this.cacheKey(fileUrl))
    const keys = [...this.loaderCache.keys()]
    const removeKeys = keys.filter(key => !retainKeys.includes(key))
    removeKeys.forEach(key => {
      const cache = this.loaderCache.get(key)
      if (cache) {
        // console.log(this.constructor.name, "flushFilesExcept removing", key)
        this.loaderCache.delete(key)
      }
    })
  }

  getCache(path: LoaderPath): LoaderCache | undefined {
    const files = this.parseUrlPath(path)
    const file = files.pop()
    assertObject(file)
    return this.loaderCache.get(file.loaderPath)
  }

  getError(graphFile: GraphFile): any {
    return this.cacheGet(graphFile)?.error
  }
  
  private getFile(graphFile: GraphFile): any {
    const cache = this.cacheGet(graphFile)
    const result = cache?.result
    if (!result) {
      const { type } = graphFile
      const key = this.key(graphFile)
      const filesKey = `${type}-${key}`
      if (cache) console.trace(this.constructor.name, `getFile NO RESULT files.${filesKey} for`, graphFile.definition?.label)
      else console.trace(this.constructor.name, `getFile NOTHING AT files.${filesKey} for`, graphFile.definition?.label, this.loaderCache.keys())
      return
    }
    return result
  }


  private getLoaderCache(file: LoaderFile, createIfNeeded?: boolean, definition?: Definition): LoaderCache | undefined {
    const { loaderPath, loaderType } = file
    const found = this.loaderCache.get(loaderPath)
    if (found ||!createIfNeeded) {
      // if (found) console.log(this.constructor.name, "getLoaderCache FOUND", loaderPath)
      // else console.log(this.constructor.name, "getLoaderCache NOT FOUND", loaderPath)

      return found
    }

    // console.log(this.constructor.name, "getLoaderCache CACHING", loaderPath)

    const definitions: Definition[] = []
    if (isDefinition(definition)) definitions.push(definition)
    const cache: LoaderCache = { loaded: false, definitions }
    //if (definition) 
    if (loaderType !== GraphFileType.Svg) this.setLoaderCache(loaderPath, cache)
    cache.promise = this.filePromise(file).then(loaded => {
      // console.log(this.constructor.name, "getLoaderCache CACHED", loaderPath, loaded.constructor.name)
      cache.loaded = true
      cache.result = loaded
      return loaded
    }).catch(error => {
      // console.log(this.constructor.name, "getLoaderCache ERROR", loaderPath, error, error.constructor.name)
      cache.error = error
      cache.loaded = true
      return error
    })
    return cache
  }

  imagePromise(url: string): Promise<LoadedImage> {
    const image = new Image()
    image.src = url
    return image.decode().then(() => image)
  }

  info(loaderPath: LoaderPath): LoadedInfo | undefined {
    if (!loaderPath) console.trace(this.constructor.name, "info NO loaderPath")
    const files = this.parseUrlPath(loaderPath)
    files.reverse()
    for (const file of files) {
      const cache = this.loaderCache.get(file.urlOrLoaderPath)
      if (!cache) continue

      const { loadedInfo } = cache
      if (isPopulatedObject(loadedInfo)) return loadedInfo
    }
  }

  key(graphFile: GraphFile): string { throw Errors.unimplemented + 'key' }

  protected lastCssUrl(string: string): string {
    const exp = /url\(([^)]+)\)(?!.*\1)/g
    const matches = string.matchAll(exp)
    const matchesArray = [...matches]
    const url = arrayLast(arrayLast(matchesArray))
    // console.log(this.constructor.name, "lastCssUrl", string, url)
    return url
  }
  loadFilesPromise(graphFiles: GraphFiles): Promise<void> {
    const promises = graphFiles.map(file => 
      this.loadGraphFilePromise(file)
    )
    return Promise.all(promises).then(EmptyMethod)
  }

  loadPromise(urlPath: string, definition?: Definition): Promise<any> {
    // console.log(this.constructor.name, "loadPromise", urlPath)
    const cache = this.loaderCache.get(urlPath)
    if (cache) {
      const { promise, result, loaded, error } = cache
      if (loaded || error) {
        // console.log(this.constructor.name, "loadPromise FOUND", error ? 'ERROR' : 'RESULT', urlPath)
        return Promise.resolve(result)
      }
      // console.log(this.constructor.name, "loadPromise FOUND PROMISE", urlPath)
      assertObject(promise)
      return promise
    }

    const files = this.parseUrlPath(urlPath)
    files.reverse()
    // console.log(this.constructor.name, "loadPromise START", files)
    const file = files.shift()
    assertObject(file)
    let promise = this.loaderFilePromise(file, definition)
    files.forEach(file => { 
      promise = promise.then(() => {
        return this.loaderFilePromise(file)
      })
    })
    return promise.then(something => {
      // console.log(this.constructor.name, "loadPromise FINISH returning", something?.constructor.name)
      return something
    })
  }


  protected loadGraphFilePromise(graphFile: GraphFile): Promise<any> {
    const { type, file, definition } = graphFile
    const url = `${type}:/${file}`
    return this.loadPromise(url, definition)
  }

  loadedFile(graphFile: GraphFile): boolean {
    const file = this.cacheGet(graphFile)
    return !!file?.loaded
  }

  private loaderCache = new Map<string, LoaderCache>()


  private loaderFilePromise(file: LoaderFile, definition?: Definition): Promise<any> {
        
    // const { loaderType, options, urlOrLoaderPath, loaderPath } = file
    let cache = this.getLoaderCache(file, true, definition)
    assertObject(cache)

    const { promise, result, loaded, error } = cache
    if (result && loaded && !error) {
      // console.log(this.constructor.name, "loaderFilePromise RESULT", file.loaderPath, result?.constructor.name)
    
      return Promise.resolve(result)
    }

    // console.log(this.constructor.name, "loaderFilePromise PROMISE", file.loaderPath)
    assertObject(promise)
    return promise
  }

  media(urlPath: LoaderPath): Loaded | undefined {
    const cache = this.loaderCache.get(urlPath)
    if (cache) {
      const { result, loaded, error } = cache
      if (loaded || error) return result
    }
  }

  parseUrlPath(id: LoaderPath | string): LoaderFiles {
    assertPopulatedString(id)

    const urls = urlsAbsolute(id, this.endpoint)
    return urls.map(url => {
      const [loaderType, options, urlOrLoaderPath] = url
      const loaderPath = `${loaderType}:${options}/${urlOrLoaderPath}`
      assertLoaderType(loaderType)
      const loaderFile: LoaderFile = {
        loaderPath, urlOrLoaderPath, loaderType, options: urlOptionsObject(options)
      }
      return loaderFile
    })
  }

  protected setLoaderCache(path: LoaderPath, cache: LoaderCache) {
    // console.log(this.constructor.name, 'setLoaderCache', path, cache.result?.constructor.name)
    this.loaderCache.set(path, cache)
  }

  sourceUrl(graphFile: GraphFile): string {
    const cache = this.cacheGet(graphFile)
    if (!cache?.loaded) return this.key(graphFile)

    const { type } = graphFile
    const { result } = cache
    assertObject(result)
    switch (type) {
      case LoadType.Image:
      case LoadType.Video: return (result as LoadedImageOrVideo).src
    }
    return ''
  }

  private updateDefinitionDuration(definition: UpdatableDurationDefinition, duration: number, audio?: boolean) {
    const { duration: definitionDuration } = definition
    if (!isAboveZero(definitionDuration)) {
      // console.log(this.constructor.name, "updateDefinitionDuration duration", definitionDuration, "=>", duration)
      definition.duration = duration
    }
    if (audio) definition.audio = true
  }

  private updateDefinitionSize(definition: UpdatableSizeDefinition, size: Size) {
    const key = this.browsing ? "previewSize" : "sourceSize"
    const { [key]: definitionSize} = definition
    if (! sizesEqual(size, definitionSize)) definition[key] = size
  }

  protected updateDefinitionFamily(definition: FontDefinition, family: string) {
    const { family: definitionFamily } = definition
    if (!definitionFamily) definition.family = family
  }

  protected updateCache(cache: LoaderCache, info: LoadedInfo) {
    cache.loadedInfo ||= {}

    const { definitions, loadedInfo } = cache
    const { duration, width, height, audible, family } = info
    const size = { width, height }
    const durating = isAboveZero(duration)
    const sizing = sizeAboveZero(size)
    if (sizing) {
      loadedInfo.width ||= size.width
      loadedInfo.height ||= size.height
    }
    if (durating) {
     if (audible) loadedInfo.audible = true
      loadedInfo.duration ||= duration
    }
    if (family) loadedInfo.family ||= family

      // console.log(this.constructor.name, "updateCache", definitions.length)
      definitions.forEach(definition => {
      if (sizing && isUpdatableSizeDefinition(definition)) {
        this.updateDefinitionSize(definition, size)
      }
      if (durating && isUpdatableDurationDefinition(definition)) {
        this.updateDefinitionDuration(definition, duration, audible)
      }
      if (family && isFontDefinition(definition)) {
        this.updateDefinitionFamily(definition, family)
      }
      // console.log(this.constructor.name, "updateCache", definition.type, definition.label)
    })
  }

  protected updateLoaderFile(file: LoaderFile, info: LoadedInfo) {
    // console.log(this.constructor.name, "updateLoaderFile", file, info)

    const cache = this.getLoaderCache(file)
    assertObject(cache)
    this.updateCache(cache, info)
  }
  
  protected updateDefinitions(graphFile: GraphFile, info: LoadedInfo) {
    // console.log(this.constructor.name, "updateDefinitions", graphFile.file, info)

    const cache = this.cacheGet(graphFile)
    assertObject(cache)
    this.updateCache(cache, info)
  }

  videoPromise(url: string): Promise<LoadedVideo> {
    return new Promise<LoadedVideo>((resolve, reject) => {
      const video = this.videoFromUrl(url)
      video.oncanplay = () => {
        video.oncanplay = null
        video.onerror = null

        const { videoWidth, clientWidth, videoHeight, clientHeight } = video
        const width = videoWidth || clientWidth
        const height = videoHeight || clientHeight
        video.width = width
        video.height = height

        // console.log(this.constructor.name, "videoPromise.oncanplay", width, height)
        resolve(video)
      }
      video.onerror = reject
      video.autoplay = false
      // video.requestVideoFrameCallback(() => {})
      video.load()
    })
  }

  private videoFromUrl(url: string): HTMLVideoElement {
    if (!globalThis.document) throw 'wrong environment'
  
    const video = globalThis.document.createElement('video')
    // video.crossOrigin = 'anonymous'
    video.src = url
    return video
  }
}
