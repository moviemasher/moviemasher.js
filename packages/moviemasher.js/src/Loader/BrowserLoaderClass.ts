import {
  Endpoint, LoadAudioPromise, LoadedVideo, LoadFontPromise,
  LoadImagePromise, LoadVideoPromise
} from "../declarations"
import { GraphFile } from "../MoveMe"
import { EmptyMethod } from "../Setup/Constants"
import { GraphFileType, GraphType, isLoadType, LoadType, LoadTypes } from "../Setup/Enums"
import { Errors } from "../Setup/Errors"
import { urlForEndpoint } from "../Utility/Url"
import { Definition } from "../Definition/Definition"
import { AudibleContextInstance } from "../Context/AudibleContext"
import { LoaderFile, LoaderSource } from "./Loader"
import { LoaderClass } from "./LoaderClass"

export class BrowserLoaderClass extends LoaderClass {
  constructor(endpoint?: Endpoint) {
    super()
    this.endpoint = endpoint || {}
  }

  private arrayBufferPromiseFromUrl(url: string): Promise<ArrayBuffer> {
    return fetch(url).then(response => response.arrayBuffer())
  }

  // private arrayBufferPromiseFromBlob(blob: Blob):Promise<ArrayBuffer> {
  //   return new Promise<ArrayBuffer>((resolve, reject) => {
  //     const reader = new FileReader()
  //     reader.onload = () => { resolve(<ArrayBuffer> reader.result) }
  //     reader.onerror = reject
  //     reader.readAsArrayBuffer(blob)
  //   })
  // }

  private audioBufferPromiseFromArrayBuffer(arrayBuffer: ArrayBuffer): Promise<AudioBuffer> {
    return AudibleContextInstance.decode(arrayBuffer)
  }

  endpoint: Endpoint = {}

  protected override filePromise(key: string, graphFile: GraphFile): LoaderFile {
    const { type, definition } = graphFile
    const definitions = new Map<string, Definition>()
    if (definition) definitions.set(definition.id, definition)
    const stringLoadTypes = LoadTypes.map(String)
    const loadable = stringLoadTypes.includes(type)
    const preloaderSource: LoaderSource = { loaded: false, definitions }
    const promise = loadable ? this.loadablePromise(graphFile, key, preloaderSource) : this.graphPromise(graphFile, key, preloaderSource)
    preloaderSource.promise = promise
    return preloaderSource as LoaderFile
  }

  private graphPromise(graphFile: GraphFile, key: string, preloaderSource: LoaderSource): Promise<void> {
    const { file, type } = graphFile

    const data = type === GraphFileType.Png ? Buffer.from(file, 'base64') : file

    // TODO: handle base64 decode and conversion to Image...
    preloaderSource.result = file
    preloaderSource.loaded = true
    return Promise.resolve()
  }

  private loadablePromise(graphFile: GraphFile, url: string, preloaderSource: LoaderSource): Promise<void> {
    const promise = this.requestPromise(graphFile, url).then(result => {
      preloaderSource.result = result
      preloaderSource.loaded = true
    }).then(EmptyMethod)
    return promise
  }

  key(graphFile: GraphFile): string {
    const { file, type } = graphFile
    if (isLoadType(type)) return urlForEndpoint(this.endpoint, file)

    return file
  }

  private remove(url: string): void {
    this.files.delete(url)
  }

  private requestAudio(url: string, graphFile: GraphFile): LoadAudioPromise {
    const promise: LoadAudioPromise = new Promise((resolve, reject) => {
      this.arrayBufferPromiseFromUrl(url)
        .then(arrayBuffer => this.audioBufferPromiseFromArrayBuffer(arrayBuffer))
        .then(buffer => {
          this.updateDefinitionDuration(graphFile.definition, buffer.duration, true)
          return buffer
        })
        .then(resolve)
        .catch(reject)
    })
    return promise
  }

  protected fontFamily(url: string): string {
    return url.replaceAll(/[^a-z0-9]/gi, '_')
  }

  protected requestFont(url: string, graphFile: GraphFile): LoadFontPromise {
    // console.log(this.constructor.name, "requestFont", url, graphFile.file)
    const family = this.fontFamily(url)
    const { definition } = graphFile
    this.updateDefinitionFamily(definition, family)
    const promise : LoadFontPromise = new Promise((resolve, reject) => {
      this.arrayBufferPromiseFromUrl(url)
        .then(buffer => {
          const face = new FontFace(family, buffer)
          return face.load()
        }).then(face => {
          // console.log(this.constructor.name, "requestFont > [FontFace].load", url, face)
          document.fonts.add(face)
          resolve(face)
        }).catch(reason => reject(reason))
    })
    return promise
  }

  protected requestImage(url: string, graphFile: GraphFile) : LoadImagePromise {
    const image = new Image()
    image.crossOrigin = "Anonymous"
    image.src = url
    return image.decode().then(() => {
      const { width, height } = image
      const dimensions = { width, height }
      this.updateDefinitionSize(graphFile.definition, dimensions)
      return Promise.resolve(image)
    })
  }

  private requestPromise(graphFile: GraphFile, url: string): Promise<any> {
    const { type } = graphFile
    // console.log(this.constructor.name, "requestPromise", type, url)
    switch (type) {
      case LoadType.Audio: return this.requestAudio(url, graphFile)
      case LoadType.Font: return this.requestFont(url, graphFile)
      case LoadType.Image: return this.requestImage(url, graphFile)
      case LoadType.Video: return this.requestVideo(url, graphFile)
      default: throw Errors.invalid.type + type
    }
  }

  private requestVideo(url: string, graphFile: GraphFile): LoadVideoPromise {
    const promise: LoadVideoPromise = new Promise((resolve, reject) => {
      return this.videoPromiseFromUrl(url).then(video => {
        const { duration, width, height } = video
        const { definition } = graphFile
        const dimensions = { width, height }
        this.updateDefinitionSize(definition, dimensions)
        const hasAudio = (video: any) => {
          return video.mozHasAudio ||
            Boolean(video.webkitAudioDecodedByteCount) ||
            Boolean(video.audioTracks?.length);
        }

        this.updateDefinitionDuration(definition, duration, hasAudio(video))
        return this.arrayBufferPromiseFromUrl(url).then(arrayBuffer => {
          return this.audioBufferPromiseFromArrayBuffer(arrayBuffer).then(audioBuffer => {
            resolve({ video, audio: audioBuffer })
          })
        })
      }).catch(reject)
    })
    return promise
  }


  private videoPromiseFromUrl(url: string): Promise<LoadedVideo> {
    return new Promise<LoadedVideo>((resolve, reject) => {
      const video = this.videoFromUrl(url)
      video.ondurationchange = () => {
        video.ondurationchange = null
        video.onerror = null
        video.width = video.videoWidth
        video.height = video.videoHeight

        resolve(video)
      }
      video.onerror = reject
      video.load()
    })
  }

  private videoFromUrl(url: string): HTMLVideoElement {
    if (!globalThis.document) throw 'wrong environment'
  
    const video = globalThis.document.createElement('video')
    video.crossOrigin = 'anonymous'
    video.src = url
    return video
  }
}
