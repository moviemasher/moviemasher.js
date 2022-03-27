import {
  Any, Endpoint, GraphFile, ValueObject,
  LoadAudioPromise, LoadedVideo, LoadFontPromise, LoadImagePromise, LoadVideoPromise
} from "../declarations"
import { EmptyMethod } from "../Setup/Constants"
import { GraphFileType, LoadType, LoadTypes } from "../Setup/Enums"
import { Errors } from "../Setup/Errors"
import { urlForEndpoint } from "../Utility/Url"
import { Definition } from "../Base/Definition"
import { AudibleContextInstance } from "../Context/AudibleContext"
import { PreloaderFile, PreloaderSource } from "./Preloader"
import { PreloaderClass } from "./PreloaderClass"

class BrowserPreloaderClass extends PreloaderClass {
  constructor(endpoint?: Endpoint) {
    super()
    this.endpoint = endpoint || {}
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

  endpoint: Endpoint = {}

  protected override filePromise(key: string, graphFile: GraphFile): PreloaderFile {
    const { type, definition } = graphFile
    const definitions = new Map<string, Definition>()
    if (definition) definitions.set(definition.id, definition)
    const stringLoadTypes = LoadTypes.map(String)
    const loadable = stringLoadTypes.includes(type)
    const preloaderSource: PreloaderSource = { loaded: false, definitions }
    const promise = loadable ? this.loadablePromise(graphFile, key, preloaderSource) : this.graphPromise(graphFile, key, preloaderSource)
    preloaderSource.promise = promise
    return preloaderSource as PreloaderFile
  }


  protected graphPromise(graphFile: GraphFile, key: string, preloaderSource: PreloaderSource): Promise<void> {
    const { file, type } = graphFile

    const data = type === GraphFileType.Png ? Buffer.from(file, 'base64') : file

    // TODO: handle base64 decode and conversion to Image...
    preloaderSource.result = file
    preloaderSource.loaded = true
    return Promise.resolve()
  }

  protected loadablePromise(graphFile: GraphFile, url: string, preloaderSource: PreloaderSource): Promise<void> {
    const promise = this.requestPromise(graphFile, url).then(result => {
      preloaderSource.result = result
      preloaderSource.loaded = true
    }).then(EmptyMethod)
    return promise
  }

  key(graphFile: GraphFile): string {
    const { file, type } = graphFile
    const stringLoadTypes = LoadTypes.map(String)
    if (stringLoadTypes.includes(type)) return urlForEndpoint(this.endpoint, file)

    return file
  }

  protected remove(url: string): void {
    this.files.delete(url)
  }

  protected requestAudio(url: string): LoadAudioPromise {
    const promise: LoadAudioPromise = new Promise((resolve, reject) => {
      this.arrayBufferPromiseFromUrl(url)
        .then(arrayBuffer => this.audioBufferPromiseFromArrayBuffer(arrayBuffer))
        .then(resolve)
        .catch(reject)
    })
    return promise
  }

  protected fontFamily(url: string): string {
    return url.replaceAll(/[^a-z0-9]/gi, '_')
  }


  protected requestFont(url: string): LoadFontPromise {
    const family = this.fontFamily(url)
    const promise : LoadFontPromise = new Promise((resolve, reject) => {
      this.arrayBufferPromiseFromUrl(url)
        .then(buffer => {
          const face = new FontFace(family, buffer)
          return face.load()
        }).then(face => {
          document.fonts.add(face)
          resolve(face)
        }).catch(reason => reject(reason))
    })
    return promise
  }

  protected requestImage(url : string) : LoadImagePromise {
    const image = new Image()
    image.crossOrigin = "Anonymous"
    image.src = url
    return image.decode().then(() => Promise.resolve(image))
  }

  protected requestPromise(graphFile: GraphFile, url: string): Promise<Any> {
    const { type } = graphFile
    // console.log(this.constructor.name, "requestPromise", type, url)
    switch (type) {
      case LoadType.Audio: return this.requestAudio(url)
      case LoadType.Font: return this.requestFont(url)
      case LoadType.Image: return this.requestImage(url)
      case LoadType.Video: return this.requestVideo(url, graphFile.options)
      default: throw Errors.invalid.type + type
    }
  }

  protected requestVideo(url: string, options?: ValueObject): LoadVideoPromise {
    const promise: LoadVideoPromise = new Promise((resolve, reject) => {
      return this.videoPromiseFromUrl(url).then(video => {
        return this.arrayBufferPromiseFromUrl(url).then(arrayBuffer => {
          return this.audioBufferPromiseFromArrayBuffer(arrayBuffer).then(audioBuffer => {
            resolve({ video, audio: audioBuffer, sequence: [] })
          })
        })
      })
      .catch(reject)
    })
    return promise
  }

  private videoPromiseFromUrl(url: string): Promise<LoadedVideo> {
    return new Promise<LoadedVideo>((resolve, reject) => {
      const video = this.videoFromUrl(url)

      video.ondurationchange = () => {
        video.ondurationchange = null
        video.width = video.videoWidth
        video.height = video.videoHeight
        // console.debug(this.constructor.name, "videoPromiseFromUrl", 'ondurationchange', video.width, video.height)
        resolve(video)
      }
      video.onerror = reject
      video.load()
    })
  }

  private videoFromUrl(url: string): HTMLVideoElement {
    const video = document.createElement('video')
    video.crossOrigin = 'anonymous'
    video.src = url
    return video
  }

}

export { BrowserPreloaderClass }
