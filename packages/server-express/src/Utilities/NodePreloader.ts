import fs from 'fs'
import https from 'https'
import http from 'http'
import path from 'path'
import md5 from 'md5'
import {
  Any, EmptyMethod, GraphFile, GraphType, LoadedInfo,
  LoadTypes, Errors, PreloaderClass, GraphFileType, PreloaderFile, Definition, PreloaderSource
} from '@moviemasher/moviemasher.js'

import { BasenameCache, ExtensionLoadedInfo } from '../Setup/Constants'
import { probingInfoPromise } from '../Command/Probing'


class NodePreloader extends PreloaderClass {
  constructor(
    public cacheDirectory: string,
    public filePrefix: string,
    public defaultDirectory: string,
    public validDirectories: string[]
  ) {
    super()
    if (!cacheDirectory) throw Errors.invalid.url + 'cacheDirectory'
    if (!filePrefix) throw Errors.invalid.url + 'filePrefix'
    if (!defaultDirectory) throw Errors.invalid.url + 'defaultDirectory'
  }

  fileInfoPromise(graphFile: GraphFile): Promise<LoadedInfo> {
    const key = this.key(graphFile)
    const preloaderFile = this.files.get(key)
    if (!preloaderFile) throw Errors.internal + 'fileInfoPromise' + key + ' ' + [...this.files.keys()]

    if (preloaderFile.loadedInfo) return Promise.resolve(preloaderFile.loadedInfo)

    const infoPath = path.join(this.cacheDirectory, `${md5(key)}.${ExtensionLoadedInfo}`)
    // console.log(this.constructor.name, "fileInfoPromise", infoPath)
    return probingInfoPromise(key, infoPath).then(info => {
      preloaderFile.loadedInfo = info
      return info
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
      const { filePrefix } = this
      if (key.startsWith(filePrefix)) throw Errors.uncached + ' filePromise ' + key

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
    if (!file) throw Errors.invalid.property + 'file'

    const { cacheDirectory, filePrefix, defaultDirectory, validDirectories } = this
    if (LoadTypes.map(String).includes(type)) {
      if (file.includes('://')) return path.resolve(
        cacheDirectory, md5(file), `${BasenameCache}${path.extname(file)}`
      )

      const resolved = path.resolve(filePrefix, defaultDirectory, file)
      const directories = [defaultDirectory, ...validDirectories]
      const prefixes = [path.resolve(cacheDirectory), ...directories.map(dir => path.resolve(filePrefix, dir))]
      const valid = prefixes.some(prefix => resolved.startsWith(prefix))
      if (!valid) throw Errors.invalid.url + resolved

      return resolved
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
    const loadable = LoadTypes.map(String).includes(type)
    const dirname = path.dirname(key)
    // console.log(this.constructor.name, "writePromise", dirname)
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
