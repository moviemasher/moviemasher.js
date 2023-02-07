
import { Endpoint, LoadedImage, LoadedImageOrVideo, LoadedVideo } from "@moviemasher/moviemasher.js/src/declarations"

import { GraphFile, GraphFiles } from "@moviemasher/moviemasher.js/src/MoveMe"
import { Errors } from "@moviemasher/moviemasher.js/src/Setup/Errors"
import { assertMedia, Media, isMedia } from "@moviemasher/moviemasher.js/src/Media/Media"
import { assertDefined, assertObject, assertPopulatedString, assertTrue, isAboveZero, isArray, isObject, isPopulatedObject } from "@moviemasher/moviemasher.js/src/Utility/Is"
import { isUpdatableSizeDefinition, UpdatableSizeDefinition } from "@moviemasher/moviemasher.js/src/Mixin/UpdatableSize/UpdatableSize"
import { isUpdatableDurationDefinition, UpdatableDurationDefinition } from "@moviemasher/moviemasher.js/src/Mixin/UpdatableDuration/UpdatableDuration"
import { FontDefinition, isFontDefinition } from "@moviemasher/moviemasher.js/src/Media/Font/Font"
import { Size, sizeAboveZero, sizesEqual } from "@moviemasher/moviemasher.js/src/Utility/Size"
import { EmptyMethod } from "@moviemasher/moviemasher.js/src/Setup/Constants"
import { GraphFileType, LoadType } from "@moviemasher/moviemasher.js/src/Setup/Enums"
import { urlOptionsObject, urlsAbsolute } from "@moviemasher/moviemasher.js/src/Utility/Url"
import { arrayLast } from "@moviemasher/moviemasher.js/src/Utility/Array"
import { isPreloadableDefinition } from "@moviemasher/moviemasher.js/src/Mixin/Preloadable/Preloadable"
import { assertLoaderType, Loaded, LoadedInfo, LoaderFile, LoaderFiles, LoaderPath } from "@moviemasher/moviemasher.js"
import { Loader, LoaderCache } from "./NodeLoader"

export class LoaderClass implements Loader {
  constructor(endpoint?: Endpoint) {
    this.endpoint = endpoint || {}
  }

  protected absoluteUrl(path: string): string { return path }

  protected browsing = true
  
  protected cacheKey(graphFile: GraphFile): string {
    const { type } = graphFile
    const key = this.key(graphFile)
    return`${type}:/${key}`
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
    const [file] = files
    if (!isObject(file)) {
      console.trace(this.constructor.name, "getCache no file for", path)
      return 
    }
    // console.log(this.constructor.name, "getCache", path, file)
    assertObject(file, 'getCache file' + path)
    return this.loaderCache.get(file.loaderPath)
  }

  private getLoaderCache(file: LoaderFile, createIfNeeded: boolean, definition?: Media): LoaderCache | undefined {
    const { loaderPath, loaderType } = file
    const found = this.loaderCache.get(loaderPath)
    if (found ||!createIfNeeded) {
      // if (found) console.log(this.constructor.name, "getLoaderCache FOUND", loaderPath)
      // else console.log(this.constructor.name, "getLoaderCache NOT FOUND", loaderPath)

      return found
    }

    // console.log(this.constructor.name, "getLoaderCache LOADING", loaderPath)

    const definitions: Media[] = []
    if (isMedia(definition)) definitions.push(definition)
    const cache: LoaderCache = { loaded: false, definitions }

    if (loaderType !== GraphFileType.Svg) this.setLoaderCache(loaderPath, cache)
    cache.promise = this.filePromise(file).then(loaded => {
      // console.log(this.constructor.name, "getLoaderCache CACHED", loaderPath, loaded?.constructor.name)
      cache.loaded = true
      cache.result = loaded
      return loaded
    }).catch(error => {
      // console.log(this.constructor.name, "getLoaderCache ERROR", loaderPath, error, error?.constructor.name)
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
    assertPopulatedString(loaderPath)

    const files = this.parseUrlPath(loaderPath)
    const [file] = files
 
    const { urlOrLoaderPath } = file
    const cache = this.loaderCache.get(urlOrLoaderPath)
    if (!cache) return

    const { loadedInfo } = cache
    if (isPopulatedObject(loadedInfo)) return loadedInfo
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

  protected loadGraphFilePromise(graphFile: GraphFile): Promise<any> {
    const { type, file, definition } = graphFile
    assertMedia(definition)
    const url = `${type}:/${file}`
    return this.loadPromise(url, definition)
  }

  loadPromise(urlPath: string | string[], definition?: Media): Promise<any> {
 
    const wasArray = isArray(urlPath)
    const urls = wasArray ? urlPath : [urlPath]
    // if (!urlHasProtocol(urls[0])) console.trace(this.constructor.name, "loadPromise", urlPath)
    const promises = urls.map(urlPath => {
      const cache = this.loaderCache.get(urlPath)
      if (cache) {
        const { promise, result, loaded, error } = cache
        if (loaded || error) {
          // console.log(this.constructor.name, "loadPromise FOUND", error ? 'ERROR' : 'RESULT', urlPath)
          return Promise.resolve(result)
        }
        // console.log(this.constructor.name, "loadPromise FOUND PROMISE", urlPath)
        assertObject(promise, 'promise')
        return promise
      }

      // console.log(this.constructor.name, "loadPromise", urlPath, this.endpoint)
      const files = this.parseUrlPath(urlPath)

      files.reverse()
      // console.log(this.constructor.name, "loadPromise START", files.map(file => file.urlOrLoaderPath))
      const file = files.shift()
      assertObject(file, 'loadPromise file ' + urlPath)
      let promise = this.loaderFilePromise(file, definition)
      files.forEach(file => { 
        promise = promise.then(() => {
          return this.loaderFilePromise(file, definition)
        })
      })
      return promise.then(something => {
        // console.log(this.constructor.name, "loadPromise FINISH returning", something?.constructor.name)
        return something
      })  
    })
    return wasArray ? Promise.all(promises) : promises[0]
  }

  loaded(urlPath: string): boolean {
    const info = this.info(urlPath)
    // console.log(this.constructor.name, "loaded", info)
    return !!info
  }

  protected loaderCache = new Map<string, LoaderCache>()


  private loaderFilePromise(file: LoaderFile, definition?: Media): Promise<any> {
    // const { loaderType, options, urlOrLoaderPath, loaderPath } = file
    let cache = this.getLoaderCache(file, true, definition)
    assertObject(cache, 'cache')

    const { promise, result, loaded, error } = cache
    if (result && loaded && !error) {
      // console.log(this.constructor.name, "loaderFilePromise RESULT", file.loaderPath, result?.constructor.name)
    
      return Promise.resolve(result)
    }

    // console.log(this.constructor.name, "loaderFilePromise PROMISE", file.loaderPath)
    assertObject(promise, 'promise')
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

    // console.log(this.constructor.name, "parseUrlPath", id, this.endpoint)

    const urls = urlsAbsolute(id, this.endpoint)
    return urls.map(url => {
      const [withColon, options, urlOrLoaderPath] = url
      const loaderType = withColon.slice(0, -1)
      const loaderPath = `${withColon}${options}/${urlOrLoaderPath}`
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
    const key = this.key(graphFile)
    const cacheKey = this.cacheKey(graphFile)
    const cache = this.loaderCache.get(cacheKey)
    if (!cache?.loaded) return key

    const { type } = graphFile
    const { result } = cache
    assertObject(result, 'result')

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

  private updateDefinitionSize(definition: UpdatableSizeDefinition, size: Size, alpha?: boolean) {
    const key = this.browsing ? "previewSize" : "sourceSize"
    const { [key]: definitionSize} = definition
    if (! sizesEqual(size, definitionSize)) definition[key] = size
    definition.alpha ||= alpha
  }

  protected updateDefinitionFamily(definition: FontDefinition, family: string) {
    const { family: definitionFamily } = definition
    if (!definitionFamily) definition.family = family
  }

  protected updateCache(cache: LoaderCache, loadedInfo: LoadedInfo) {
    cache.loadedInfo ||= {}

    const { definitions, loadedInfo: cachedInfo } = cache
    const { duration, width, height, audible, family, info, alpha } = loadedInfo
    const size = { width, height }
    const durating = isAboveZero(duration)
    const sizing = sizeAboveZero(size)
    const informing = isObject(info)
    if (sizing) {
      cachedInfo.width ||= size.width
      cachedInfo.height ||= size.height
    }
    if (durating) {
     if (audible) cachedInfo.audible = true
      cachedInfo.duration ||= duration
    }
    if (family) cachedInfo.family ||= family

    console.log(this.constructor.name, "updateCache", loadedInfo, definitions.length)
    definitions.forEach(definition => {
     
      // if (informing && isPreloadableDefinition(definition)) definition.info ||= info
      if (sizing && isUpdatableSizeDefinition(definition)) {
        this.updateDefinitionSize(definition, size, alpha)
      }
      if (durating && isUpdatableDurationDefinition(definition)) {
        this.updateDefinitionDuration(definition, duration, audible)
      }
      if (family && isFontDefinition(definition)) {
        this.updateDefinitionFamily(definition, family)
      }
      console.log(this.constructor.name, "updateCache", definition.type, definition.label)
    })
  }

  updateDefinition(loaderPath: string, definition: Media) {
    console.log(this.constructor.name, "updateDefinition", definition.type, definition.label, loaderPath)

    const cache = this.getCache(loaderPath)
    assertDefined(cache, 'cache')

    const { definitions, loadedInfo} = cache
    assertDefined(loadedInfo, 'loadedInfo')

    if (!definitions.includes(definition)) definitions.push(definition)
    this.updateCache(cache, loadedInfo) 
  }

  protected updateLoaderFile(file: LoaderFile, info: LoadedInfo) {
    // console.log(this.constructor.name, "updateLoaderFile", file, info)
    // const { definition } = info
    const cache = this.getLoaderCache(file, false)
    assertObject(cache, 'cache')
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