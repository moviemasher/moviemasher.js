import {
  Endpoint, LoadedAudio, LoadedFont, LoadedImage, LoadedSvgImage, LoadedVideo, ScalarObject} from "../declarations"
import { GraphFile } from "../MoveMe"
import { assertLoadType, GraphFileType, isLoadType, isOrientation, isUploadType, LoadType } from "../Setup/Enums"
import { Errors } from "../Setup/Errors"
import { urlForEndpoint, urlIsHttp, urlIsObject, urlPrependProtocol } from "../Utility/Url"
import { AudibleContextInstance } from "../Context/AudibleContext"
import { DefinitionOrErrorObject, ErrorObject, isLoadedImage, isLoadedVideo, Loaded, LoadedImageOrVideo, LoadedInfo, LoadedMedia, LoaderCache, LoaderFile, LoaderPath } from "./Loader"
import { LoaderClass } from "./LoaderClass"
import { assertObject, assertPopulatedString, assertPositive, assertTrue, isAboveZero } from "../Utility/Is"
import { Size, sizeAboveZero, sizeCopy, sizeCover, sizeString } from "../Utility/Size"
import { timeFromArgs, timeFromSeconds } from "../Helpers/Time/TimeUtilities"
import { Time } from "../Helpers/Time/Time"
import { DefinitionObject } from "../Definition/Definition"
import { svgElement, svgImageElement, svgSet, svgSetDimensionsLock } from "../Utility/Svg"
import { idGenerateString, idTemporary } from "../Utility/Id"

export class BrowserLoaderClass extends LoaderClass {
  constructor(endpoint?: Endpoint) {
    super(endpoint)

    const [canvas, context] = this.canvasContext({ width: 1, height: 1 })
    context.fillRect(0, 0, 1, 1)
    this.svgImagePromise(canvas.toDataURL()).then(() => {
      this.svgImageEmitsLoadEvent = true
    })
  }

  protected override absoluteUrl(path: string): string { 
    return urlForEndpoint(this.endpoint, path)
  }

  private arrayBufferPromise(url: string): Promise<ArrayBuffer> {
    // console.log(this.constructor.name, "arrayBufferPromise", url)

    return fetch(url).then(response => response.arrayBuffer())
  }

  private audioBufferPromise(audio: ArrayBuffer): Promise<AudioBuffer> {
    return AudibleContextInstance.decode(audio)
  }

  private audioInfo(buffer: AudioBuffer): LoadedInfo {
    const { duration } = buffer
    const info: LoadedInfo = { duration, audible: true }
    return info
  }

  private audioPromise(url:string): Promise<LoadedAudio> {
    assertPopulatedString(url, 'url')
    const isBlob = url.startsWith('blob:')
    // console.log(this.constructor.name, "audioPromise", isBlob ? 'BLOB' : url)
    const promise = isBlob ? this.blobAudioPromise(url) : this.arrayBufferPromise(url)
    return promise.then(buffer => this.audioBufferPromise(buffer))
  }

  private blobAudioPromise(url: string): Promise<ArrayBuffer> {
    // console.log(this.constructor.name, "blobAudioPromise")

    return fetch(url).then(response => response.blob()).then(blob => {
      return new Promise<ArrayBuffer>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => { resolve(reader.result as ArrayBuffer) }
        reader.onerror = reject
        reader.readAsArrayBuffer(blob)
      }) 
    })
  }

  private svgImageEmitsLoadEvent = false

  private canvas(size: Size): HTMLCanvasElement {
    const { width, height } = size
    const canvas = document.createElement('canvas')
    canvas.height = height
    canvas.width = width
    return canvas
  }

  private canvasContext(size: Size): [HTMLCanvasElement, CanvasRenderingContext2D] {
    const canvas = this.canvas(size)
    const context = canvas.getContext('2d')
    assertTrue(context)
    return [canvas, context]
  }


  protected override filePromise(file: LoaderFile): Promise<Loaded> {
    const { loaderType } = file
    // console.log(this.constructor.name, "filePromise", loaderType)
    switch (loaderType) {
      case LoadType.Audio: return this.requestAudio(file)
      case LoadType.Font: return this.requestFont(file)
      case LoadType.Image: return this.requestImage(file)
      case LoadType.Video: return this.requestVideo(file)
      case GraphFileType.Svg: return this.requestSvgImage(file)
    }
    throw Errors.invalid.type + loaderType
  }

  filePromises(files: File[], size?: Size): Promise<DefinitionOrErrorObject>[] {
    return files.map(file => {
      const { name: label, type: fileType } = file
      const type = fileType.split('/').shift()
      const error: ErrorObject = { label, error: '' }
      if (!isUploadType(type)) {
        return Promise.resolve({ ...error, error: 'import.type', value: type })
      }
      
      const id = idGenerateString()
      const idKey = urlPrependProtocol('object', id)
      const url = URL.createObjectURL(file)
      const object: DefinitionObject = {
        type, label, url: urlPrependProtocol(type, idKey), source: url, id: idTemporary()
      }
      const isAudio = type === LoadType.Audio
      const isImage = type === LoadType.Image
      const hasDuration = isAudio || type === LoadType.Video
      const hasSize = type === LoadType.Image || type === LoadType.Video
      const mediaPromise = this.mediaPromise(type, url)
      return mediaPromise.then(media => {
        const info = this.mediaInfo(media)
        if (hasDuration) {
          const { duration } = info
          if (!isAboveZero(duration)) return { 
            ...error, error: 'import.duration', value: duration
          }
          // we can't reliably tell if there is an audio track...
          // so we assume there is one, and catch problems when it's played 
          object.audio = true
          object.duration = duration
          object.audioUrl = hasSize ? urlPrependProtocol('video', idKey) : idKey
        }
        if (hasSize) {
          const inSize = sizeCopy(info)
          if (!sizeAboveZero(inSize)) return { 
            ...error, error: 'import.size', value: sizeString(inSize)
          }
          const previewSize = size ? sizeCover(inSize, size, true) : inSize
          const { width, height } = previewSize
          object.previewSize = previewSize

          if (isImage) {
            object.icon = urlPrependProtocol('image', idKey, { width, height })
            object.loadedImage = media
          } else {
            object.icon = urlPrependProtocol('video', idKey, { fps: 10 })
            object.loadedVideo = media
          }
        } else object.loadedAudio = media
        
        this.loadLocalFile(media, idKey, info)
        return object
      })
    })
  }

  protected fontFamily(url: string): string {
    return url.replaceAll(/[^a-z0-9]/gi, '_')
  }

  imageInfo(size: Size): LoadedInfo {
    return sizeCopy(size)
  }
  
  key(graphFile: GraphFile): string {
    const { file, type } = graphFile
    if (isLoadType(type)) return urlForEndpoint(this.endpoint, file)

    return file
  }

  private loadLocalFile(media: LoadedMedia, cacheKey: LoaderPath, loadedInfo: LoadedInfo): void {
    const cache: LoaderCache = {
      definitions: [], result: media, loadedInfo,
      promise: Promise.resolve(media), loaded: true, 
    }
    this.setLoaderCache(cacheKey, cache)
  }

  private mediaInfo(media: LoadedMedia): LoadedInfo {
    if (isLoadedVideo(media)) return this.videoInfo(media)
    if (isLoadedImage(media)) return this.imageInfo(media)
    return this.audioInfo(media)
    
  }

  private mediaPromise(type: LoadType, url: string): Promise<LoadedMedia> {
    assertLoadType(type)
    assertPopulatedString(url, 'url')
    switch(type) {
      case LoadType.Audio: return this.audioPromise(url)
      case LoadType.Image: return this.imagePromise(url)
      case LoadType.Video: return this.videoPromise(url)
    }
    throw Errors.internal
  }

  private requestAudio(file: LoaderFile): Promise<LoadedAudio> {
    const { urlOrLoaderPath, options } = file
    assertPopulatedString(urlOrLoaderPath, 'urlOrLoaderPath')
    if (urlIsHttp(urlOrLoaderPath)) return this.audioPromise(urlOrLoaderPath).then(buffer => {
      assertObject(buffer)
      this.updateLoaderFile(file, this.audioInfo(buffer))
      return buffer
    })
    if (urlOrLoaderPath.startsWith('video:')) return this.requestVideoAudio(file)

    return this.loadPromise(urlOrLoaderPath)
  }

  protected requestFont(file: LoaderFile): Promise<LoadedFont> {
    const { urlOrLoaderPath: url} = file
    const bufferPromise = this.arrayBufferPromise(url)
    const family = this.fontFamily(url)
    const facePromise = bufferPromise.then(buffer => {
      // console.log(this.constructor.name, "requestFont.bufferPromise", url)
      const face = new FontFace(family, buffer)
      return face.load()
    })
    return facePromise.then(face => {
      // console.log(this.constructor.name, "requestFont.facePromise", url, face)
      const { fonts } = globalThis.document
      fonts.add(face)
      // console.log(this.constructor.name, "requestFont.facePromise", fonts.status)
      const info: LoadedInfo = { family }
      this.updateLoaderFile(file, info)
      return face
    })
  }

  protected requestImage(file: LoaderFile): Promise<LoadedImage> {
    const { urlOrLoaderPath } = file
    if (!urlIsHttp(urlOrLoaderPath)) return this.requestLoadedImage(file)
  
  
    return this.imagePromise(urlOrLoaderPath).then(image => {
      const { width, height } = image
      // console.log(this.constructor.name, "requestImage.imagePromise", width, height)
      const info: LoadedInfo = { width, height }
      this.updateLoaderFile(file, info)
      return image
    })
  }

  private requestLoadedImage(file: LoaderFile): Promise<LoadedImage> {
    const { urlOrLoaderPath, options } = file
    // url is loader path pointing to video or image
    // options might be size 
    // console.log(this.constructor.name, "requestLoadedImage", urlOrLoaderPath, options)
    const promise = this.loadPromise(urlOrLoaderPath)
    const protocol = urlOrLoaderPath.split(':').shift()
    if (!(protocol === LoadType.Video || options)) return promise
     
    return promise.then(videoOrImage => { 
      // console.log(this.constructor.name, "requestLoadedImage.loadPromise", urlOrLoaderPath, videoOrImage.constructor.name)
 
      const inSize = sizeCopy(videoOrImage)
      const size = sizeAboveZero(options) ? sizeCover(inSize, options) : inSize
      const { width, height } = size
      const [canvas, context] = this.canvasContext(size)
      context.drawImage(videoOrImage, 0, 0, width, height)
      return this.imagePromise(canvas.toDataURL())
    })
  }

  private requestSvgImage(file: LoaderFile): Promise<LoadedSvgImage> {
    const { urlOrLoaderPath, options } = file
    // console.log(this.constructor.name, "requestSvgImage", urlOrLoaderPath)

    return this.sourcePromise(urlOrLoaderPath).then(src => {
      
      // console.log(this.constructor.name, "requestSvgImage.sourcePromise", urlOrLoaderPath, src.length)

      const promise = this.svgImagePromise(src)

      if (!options) {
        // console.log(this.constructor.name, "requestSvgImage.sourcePromise NO OPTIONS", urlOrLoaderPath)

        return promise
      }

      return promise.then(item => {
        // console.log(this.constructor.name, "requestSvgImage.svgImagePromise OPTIONS", urlOrLoaderPath, options)

        const { lock, ...rest } = options
        const lockDefined = isOrientation(lock) ? lock : undefined
        svgSetDimensionsLock(item, rest, lockDefined)
         
        // console.log(this.constructor.name, "requestSvgImage.svgImagePromise returning", item?.constructor.name)

        return item
      })
    })
  }

  private requestVideo(file: LoaderFile): Promise<LoadedVideo> {
    const { urlOrLoaderPath, options } = file
    // console.log(this.constructor.name, "requestVideo", urlOrLoaderPath, options)
    const isObject = urlIsObject(urlOrLoaderPath)
    const isHttp = urlIsHttp(urlOrLoaderPath)
    if (options) {
      // if (isObject || isHttp) {
        // console.log(this.constructor.name, "requestVideo with OPTIONS", urlOrLoaderPath, options)
        return this.seekingVideoPromise(urlOrLoaderPath, options)
      // }
    } else if (isHttp) {
      // console.log(this.constructor.name, "requestVideo HTTP without OPTIONS", urlOrLoaderPath)
      return this.videoPromise(urlOrLoaderPath).then(video => {
        const info = this.videoInfo(video)
        this.updateLoaderFile(file, info)
        return video
      })
    }
    // console.log(this.constructor.name, "requestVideo LOADING", urlOrLoaderPath, options)
    return this.loadPromise(urlOrLoaderPath)
  }

  private requestVideoAudio(file: LoaderFile): Promise<LoadedAudio> {
    const { urlOrLoaderPath } = file
    // console.log(this.constructor.name, "requestVideoAudio", urlOrLoaderPath)

    return this.loadPromise(urlOrLoaderPath).then((video: LoadedVideo) => {
      const { src } = video
      // console.log(this.constructor.name, "requestVideoAudio.loadPromise", urlOrLoaderPath, src?.slice(0, 10))
      assertPopulatedString(src)
      return this.audioPromise(src)
    })
  }

  private seek(definitionTime: Time, video:HTMLVideoElement): void {
    if (!video) throw Errors.internal + 'seek'

    video.currentTime = definitionTime.seconds
  }

  private seekNeeded(definitionTime: Time, video:HTMLVideoElement): boolean {
    const { currentTime } = video
    if (!(currentTime || definitionTime.frame)) return true

    const videoTime = timeFromSeconds(currentTime, definitionTime.fps)
    return !videoTime.equalsTime(definitionTime)
  }

  private seekPromise(key: string, definitionTime: Time, video:HTMLVideoElement): Promise<LoadedVideo> {
    // console.log(this.constructor.name, "seekPromise", key, definitionTime, video.currentTime)
    
    
    const promise:Promise<LoadedVideo> = new Promise(resolve => {
      if (!this.seekNeeded(definitionTime, video)) {
        // console.log(this.constructor.name, "seekPromise seekNeeded false", key, definitionTime, video.currentTime)
        this.seekingPromises.delete(key)
        return resolve(video)
      }
      video.onseeked = () => {
        // console.log(this.constructor.name, "seekPromise.onseeked", key, definitionTime, video.currentTime)
        video.onseeked = null
        this.seekingPromises.delete(key)
        resolve(video)
      }
      this.seek(definitionTime, video)
    })
    const existing = this.seekingPromises.get(key)
    this.seekingPromises.set(key, promise)
    if (existing) return existing.then(() => promise)
    return promise
  }

  // private seekingPromises = new Map<string, Promise<void>>()


  private copyVideoPromise(url: string, options: ScalarObject): Promise<LoadedVideo> {
    assertObject(options)
    // console.log(this.constructor.name, "copyVideoPromise", url, options)
    const key = url.split(':').pop()
    assertPopulatedString(key)

    const video = this.seekingVideos.get(key)
    if (video) return Promise.resolve(video)

    const promise = this.seekingVideoPromises.get(key)
    if (promise) return promise

    const sourcePromise = this.sourcePromise(url)
    const copyPromise = sourcePromise.then(source => {
      return this.videoPromise(source).then(video => {
        // console.log(this.constructor.name, "copyVideoPromise.videoPromise", source)

        const initialSeekPromise = this.seekPromise(key, timeFromSeconds(1), video).then(() => {
          // console.log(this.constructor.name, "copyVideoPromise.seekPromise", source)
          this.seekingVideos.set(key, video)
          
          return video
        })
        return initialSeekPromise
      })    
    })
    this.seekingVideoPromises.set(key, copyPromise)
    return copyPromise
  }

  private seekingVideoPromise = (url: string, options: ScalarObject): Promise<LoadedVideo> => {
    assertObject(options)
    // console.log(this.constructor.name, "seekingVideoPromise", url, options)
    const key = url.split(':').pop()
    assertPopulatedString(key)

    return this.copyVideoPromise(url, options).then(video => {
      // console.log(this.constructor.name, "seekingVideoPromise.copyVideoPromise", key)
      
      const { frame = 0, fps } = options
      assertPositive(frame)
      assertPositive(fps)
      const time = timeFromArgs(frame, fps)
      return this.seekPromise(key, time, video)
    })
    // const promise = this.seekingVideoPromises.get(key)
    

    // const sourcePromise = this.sourcePromise(url)
    // const copyPromise = 
    // sourcePromise.then(source => {
    //   const seekingVideo = this.seekingVideos.get(key)
    //   if (seekingVideo) {
    //     // console.log(this.constructor.name, "seekingVideoPromise.sourcePromise GOT seekingVideo")
        
    //     return Promise.resolve(seekingVideo)
    //   }
    //   const seekingVideoPromise = this.seekingVideoPromises.get(key)
    //   if (seekingVideoPromise) {
    //     // console.log(this.constructor.name, "seekingVideoPromise.sourcePromise GOT seekingVideoPromise")

    //     return seekingVideoPromise
    //   }
    //   return this.videoPromise(source).then(video => {
    //     // console.log(this.constructor.name, "seekingVideoPromise.videoPromise", source)

    //     const initialSeekPromise = this.seekPromise(timeFromSeconds(1), video).then(() => {
    //       // console.log(this.constructor.name, "seekingVideoPromise.seekPromise", source)
    //       this.seekingVideos.set(key, video)
    //       this.seekingVideoPromises.delete(key)
    //       return video
    //     })
    //     return initialSeekPromise
    //   })
    // })
  
  }

  private seekingVideoPromises = new Map<string, Promise<LoadedVideo>>()
  private seekingPromises = new Map<string, Promise<LoadedVideo>>()

  private seekingVideos = new Map<string, LoadedVideo>()

  private sourcePromise(path: LoaderPath): Promise<string> {
    if (urlIsHttp(path)) return Promise.resolve(path) 
  
    return this.loadPromise(path).then((loaded: LoadedImageOrVideo) => { 
      assertObject(loaded)
     
      const { src } = loaded
      // console.log(this.constructor.name, "sourcePromise", path, "->", src?.length, src?.slice(0, 20))
      assertPopulatedString(src)
      return src
    })
  }
  private _svgElement?: SVGSVGElement
  get svgElement() { return this._svgElement ||= svgElement() }
  set svgElement(value) { this._svgElement = value}

  private svgImagePromise(url: string): Promise<LoadedSvgImage> {
    return new Promise<LoadedSvgImage>((resolve, reject) => {
      const element = svgImageElement()
      
      const completed = () => {
        element.removeEventListener('error', failed)
        element.removeEventListener('load', passed)
        if (!this.svgImageEmitsLoadEvent) this.svgElement.removeChild(element)
      }
      const failed = (error: any) => {
        // console.log(this.constructor.name, "loadsSvgImagesInitialize failed", error)
        completed()
        reject(error)
      }

      const passed = () => {
        // console.log(this.constructor.name, "loadsSvgImagesInitialize passed")
        resolve(element)
        completed()
      }

      element.addEventListener('error', failed, { once: true })
      element.addEventListener('load', passed, { once: true })
      if (!this.svgImageEmitsLoadEvent) this.svgElement.appendChild(element)
      svgSet(element, url, 'href')
    })
  }


  private videoInfo(video: LoadedVideo) {
    const { 
      duration, videoWidth, clientWidth, videoHeight, clientHeight 
    } = video
    const width = videoWidth || clientWidth
    const height = videoHeight || clientHeight
    
    const object = video as any
    let audible = object.mozHasAudio
    audible ||= Boolean(object.webkitAudioDecodedByteCount)
    audible ||= Boolean(object.audioTracks?.length)
    if (!audible) console.log(Object.values(video))
    const info: LoadedInfo = { width, height, duration, audible }
    return info
  }
}


