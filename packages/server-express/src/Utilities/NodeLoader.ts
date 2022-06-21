import fs from 'fs'
import https from 'https'
import http from 'http'
import path from 'path'
import md5 from 'md5'
import {
  EmptyMethod, GraphFile, GraphType, LoadedInfo, isPreloadableDefinition,
  LoadTypes, Errors, LoaderClass, GraphFileType, LoaderFile, Definition,
  LoaderSource,
  isAboveZero, isLoadType, assertPopulatedString, isUpdatableDurationDefinition, isUpdatableDimensionsDefinition
} from '@moviemasher/moviemasher.js'

import { BasenameCache, ExtensionLoadedInfo } from '../Setup/Constants'
import { probingInfoPromise } from '../Command/Probing'

export class NodeLoader extends LoaderClass {
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


  private applyLoadedInfo(graphFile: GraphFile, loadedInfo: LoadedInfo): void {
    const { definition } = graphFile
    const { duration, width, height } = loadedInfo
    if (isUpdatableDurationDefinition(definition) && !isAboveZero(definition.duration)) {
      if (isAboveZero(duration)) definition.duration = duration
      // console.log(this.constructor.name, "applyLoadedInfo duration", definition.id, definition.duration)
    }
    if (isUpdatableDimensionsDefinition(definition) && !isAboveZero(definition.width)) {
      if (isAboveZero(width)) definition.width = width
      if (isAboveZero(height)) definition.height = height
      // console.log(this.constructor.name, "applyLoadedInfo dimensions", definition.id, `${width}x${height}`)
    }
  }

  protected override filePromise(key: string, graphFile: GraphFile): LoaderFile {
    const { definition } = graphFile
    const definitions = new Map<string, Definition>()
    definitions.set(definition.id, definition)
    const preloaderSource: LoaderSource = { loaded: false, definitions }
    if (fs.existsSync(key)) {
      preloaderSource.promise = this.updateSources(key, preloaderSource, graphFile)
    } else {
      const { filePrefix } = this
      if (key.startsWith(filePrefix)) throw Errors.uncached + ' filePromise ' + key

      preloaderSource.promise = this.writePromise(graphFile, key).then(() => {
        return this.updateSources(key, preloaderSource, graphFile)
      })
    }
    return preloaderSource as LoaderFile
  }

  getFile(_graphFile: GraphFile): any { throw Errors.unimplemented + 'getFile' }

  graphType = GraphType.Mash

  key(graphFile: GraphFile): string {
    const { type, file } = graphFile
    assertPopulatedString(file)

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

  private updateableDefinitions(preloaderSource: LoaderSource): Definition[] {
    const definitions = [...preloaderSource.definitions.values()]
    const preloadableDefinitions = definitions.filter(definition => {
      return isPreloadableDefinition(definition)
    })

    return preloadableDefinitions.filter(definition => {
      const trimmable = isUpdatableDurationDefinition(definition)
      if (trimmable && !isAboveZero(definition.duration)) return true

      return isUpdatableDimensionsDefinition(definition) && !isAboveZero(definition.width)
    })
  }


  private updateSources(key: string, preloaderSource: LoaderSource, graphFile: GraphFile): Promise<void> {
    preloaderSource.loaded = true
    preloaderSource.definitions.forEach(definition => {
      if (!isPreloadableDefinition(definition)) return

      if (!definition.source.startsWith('http')) definition.source = key
    })

    const { type } = graphFile
    if (!isLoadType(type)) return Promise.resolve()

    const neededDefinitions = this.updateableDefinitions(preloaderSource)
    if (!neededDefinitions.length) return Promise.resolve()

    const preloaderFile = preloaderSource as LoaderFile

    const infoPath = path.join(this.cacheDirectory, `${md5(key)}.${ExtensionLoadedInfo}`)
    // console.log(this.constructor.name, "fileInfoPromise", infoPath)
    return probingInfoPromise(key, infoPath).then(info => {
      preloaderFile.loadedInfo = info
      return info
    }).then(loadedInfo => { this.applyLoadedInfo(graphFile, loadedInfo) })
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
