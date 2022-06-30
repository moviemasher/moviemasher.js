import fs from 'fs'
import https from 'https'
import http from 'http'
import path from 'path'
import md5 from 'md5'

import {
  EmptyMethod, GraphFile, GraphType, LoadedInfo, isPreloadableDefinition,
  Errors, LoaderClass, GraphFileType, LoaderFile, Definition,
  LoaderSource,
  isAboveZero, isLoadType, assertPopulatedString, isUpdatableDurationDefinition, isUpdatableDimensionsDefinition, PopulatedString} from '@moviemasher/moviemasher.js'

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

    const dimensions = { width, height }
    this.updateDefinitionDimensions(definition, dimensions)
    this.updateDefinitionDuration(definition, duration)
    
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
    const { type, file, resolved } = graphFile
    if (resolved) return resolved

    assertPopulatedString(file)

    const { cacheDirectory, filePrefix, defaultDirectory, validDirectories } = this
    if (isLoadType(type)) {
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
    const fileName = this.graphFileTypeBasename(type, file) 
    return path.resolve(cacheDirectory, md5(file), fileName) 
  }

  private graphFileTypeBasename(type: GraphFileType, file: PopulatedString) {
    if (type !== GraphFileType.SvgSequence) return `${BasenameCache}.${type}`
    const fileCount = file.split("\n").length
    const digits = String(fileCount).length
    return `%0${digits}.svg`
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
    const { definitions, result } = preloaderSource
    preloaderSource.loaded = true
    definitions.forEach(definition => {
      if (!isPreloadableDefinition(definition)) return

      if (!definition.source.startsWith('http')) {
        definition.source = key
        definition.urlAbsolute = key
      }
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
    const dirname = path.dirname(key)
    let promise = fs.promises.mkdir(dirname, { recursive: true }).then(EmptyMethod)

    if (isLoadType(type)) {
      if (file.startsWith('http')) {
        return promise.then(() => this.remotePromise(key, file))
      } 
      // local files should already exist!
      throw Errors.uncached + file 
    } 
    switch(type) {
      case GraphFileType.SvgSequence: return promise.then(() => {
        const svgs = file.split("\n")
        const { length } = svgs
        const digits = String(length).length
        return Promise.all(svgs.map((svg, index) => {
          const fileName = `${String(index).padStart(digits, '0')}.svg`
          const filePath = path.join(dirname, fileName)
          return fs.promises.writeFile(filePath, svg)
        })).then(EmptyMethod)
      })
      case GraphFileType.Png: return promise.then(() => {
        return fs.promises.writeFile(key, Buffer.from(file, 'base64'))
      })
    }
    return promise.then(() => fs.promises.writeFile(key, file))
  }
}
