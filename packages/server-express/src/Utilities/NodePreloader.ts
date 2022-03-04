import fs from 'fs'
import https from 'https'
import http from 'http'
import path from 'path'
import md5 from 'md5'
import Ffmpeg from 'fluent-ffmpeg'
import {
  Any, EmptyMethod, GraphFile, GraphType, LoadedInfo,
  LoadTypes, Errors, PreloaderClass, GraphFileType, PreloaderFile, Definition, PreloaderSource
} from '@moviemasher/moviemasher.js'

import { commandProcess } from '../Command/CommandFactory'
import { BasenameCache } from '../Setup/Constants'


class NodePreloader extends PreloaderClass {
  constructor(cacheDirectory: string, fileDirectory: string) {
    super()
    this.cacheDirectory = cacheDirectory
    this.fileDirectory = fileDirectory
  }

  cacheDirectory: string

  fileDirectory: string

  fileInfoPromise(graphFile: GraphFile): Promise<LoadedInfo> {
    const key = this.key(graphFile)
    const preloaderFile = this.files.get(key)
    if (!preloaderFile) throw Errors.internal + 'fileInfoPromise' + key + ' ' + [...this.files.keys()]

    if (preloaderFile.loadedInfo) return Promise.resolve(preloaderFile.loadedInfo)

    const process = commandProcess()
    process.addInput(key)
    return new Promise((resolve, reject) => {
      process.ffprobe((error: any, data: Ffmpeg.FfprobeData) => {
        if (error) {
          console.error(process._getArguments(), error)
          reject(error)
          return
        }
        const info: LoadedInfo = {}
        const { streams, format } = data
        const { duration } = format
        if (duration) info.duration = duration
        for (const stream of streams) {
          const { width, height } = stream
          if (width && height) {
            info.width = width
            info.height = height
            break
          }
        }
        // console.log(this.constructor.name, "fileInfoPromise", info)
        preloaderFile.loadedInfo = info
        resolve(info)
      })
    })
  }

  protected override filePromise(key: string, graphFile: GraphFile): PreloaderFile {
    const { definition } = graphFile
    const definitions = new Map<string, Definition>()
    if (definition) definitions.set(definition.id, definition)
    const preloaderSource: PreloaderSource = { loaded: false, definitions }

    if (fs.existsSync(key)) {
      // console.log(this.constructor.name, "filePromise existent", key)
      this.updateSources(key, preloaderSource)
      preloaderSource.promise = Promise.resolve()
    } else {
      // console.log(this.constructor.name, "filePromise nonexistent", key)
      const { fileDirectory } = this
      if (key.startsWith(fileDirectory)) throw Errors.uncached + ' filePromise ' + key

      preloaderSource.promise = this.writePromise(graphFile, key).then(() => {
        this.updateSources(key, preloaderSource)
      })
    }
    return preloaderSource as PreloaderFile
  }

  getFile(_graphFile: GraphFile): Any { throw Errors.unimplemented + 'getFile' }

  graphType = GraphType.Mash

  key(graphFile: GraphFile): string {
    const { type, file } = graphFile
    const { cacheDirectory, fileDirectory } = this
    if (LoadTypes.includes(type)) {
      if (file.includes('://')) {
        return path.resolve(cacheDirectory, md5(file), `${BasenameCache}${path.extname(file)}`)
      }
      if (file.includes('./')) throw Errors.invalid.url + file

      return path.resolve(fileDirectory, file)
    }
    if (file.startsWith('/')) console.trace(this.constructor.name, "key", file, type, md5(file))
    return path.resolve(cacheDirectory, md5(file), `${BasenameCache}.${type}`)
  }

  private remotePromise(key: string, url: string): Promise<void> {
    const promise: Promise<void> = new Promise((resolve, reject) => {
      const callback = (res: http.IncomingMessage) => {
        const stream = fs.createWriteStream(key)
        res.pipe(stream)
        stream.on('finish', () => {
          stream.close()
          resolve()
        })
        stream.on('error', (error) => { reject(error) })
      }
      if (url.startsWith('https://')) https.get(url, callback)
      else http.get(url, callback)
    })
    return promise
  }

  private writePromise(graphFile: GraphFile, key: string): Promise<void> {
    const { file, type } = graphFile
    const loadable = LoadTypes.includes(String(type))

    const dirname = path.dirname(key)
    let promise = fs.promises.mkdir(dirname, { recursive: true }).then(EmptyMethod)

    if (loadable) {
      if (file.startsWith('http')) {
        promise = promise.then(() => this.remotePromise(key, file))
      } else throw Errors.uncached + file // local files should already exist!
    } else {
      // console.log(this.constructor.name, "writePromise writeFile", key, file)
      const data = type === GraphFileType.Png ? Buffer.from(file, 'base64') : file
      promise = promise.then(() => fs.promises.writeFile(key, data))
    }
    return promise
  }
}

export { NodePreloader }
