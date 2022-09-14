import fs from 'fs'
import https from 'https'
import http from 'http'
import path from 'path'
import md5 from 'md5'

import {
  EmptyMethod, GraphFile, GraphType, LoadedInfo, isPreloadableDefinition,
  Errors, LoaderClass, GraphFileType, LoaderCache, Definition,
  isAboveZero, isLoadType, assertPopulatedString, isUpdatableDurationDefinition, isUpdatableSizeDefinition, PopulatedString, sizeAboveZero, Loaded, assertObject, isDefinition, isLoaderType, LoadType
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

  protected override browsing = false

  protected cachePromise(url: string, graphFile: GraphFile, cache: LoaderCache): Promise<Loaded> {
    // console.log(this.constructor.name, "filePromise", key)
    if (fs.existsSync(url)) {
      // console.log(this.constructor.name, "filePromise existent")
      return this.updateSources(url, cache, graphFile)
    } 
    
    const { filePrefix } = this
    if (url.startsWith(filePrefix)) throw Errors.uncached + ' filePromise ' + url

    return this.writePromise(graphFile, url).then(() => {
      return this.updateSources(url, cache, graphFile)
    })
  }

  getFile(_graphFile: GraphFile): any { throw Errors.unimplemented + 'getFile' }

  graphType = GraphType.Mash

  private graphFileTypeBasename(type: GraphFileType, content: PopulatedString) {
    if (type !== GraphFileType.SvgSequence) return `${BasenameCache}.${type}`
    const fileCount = content.split("\n").length
    const digits = String(fileCount).length
    return `%0${digits}.svg`
  }

  infoPath(key: string): string {
    return path.join(this.cacheDirectory, `${md5(key)}.${ExtensionLoadedInfo}`)
  }

  key(graphFile: GraphFile): string {
    const { type, file, content, resolved: key } = graphFile
    if (key) {
      // console.log(this.constructor.name, "key RESOLVED", type, file, key)
      return key
    }
    assertPopulatedString(file, 'file')

    const { cacheDirectory, filePrefix, defaultDirectory, validDirectories } = this
    if (!isLoadType(type)) {

      if (!type) console.trace(this.constructor.name, "key NOT LOADTYPE", type, file, content)

      // file is clip.id, content contains text of file
      assertPopulatedString(content, 'content')
      
      const fileName = this.graphFileTypeBasename(type, content) 
      return path.resolve(cacheDirectory, file, fileName) 
    }

  
    // file is url, if absolute then use md5 as directory name
    if (file.includes('://')) {
      console.log(this.constructor.name, "key LOADTYPE ABSOLUTE", type, file, content)
      const extname = path.extname(file)
      const ext = extname || this.typeExtension(type)
      return path.resolve(
        cacheDirectory, md5(file), `${BasenameCache}${ext}`
      )
    }
      // console.log(this.constructor.name, "key LOADTYPE NOT ABSOLUTE", type, file)

    const resolved = path.resolve(filePrefix, defaultDirectory, file)
    const directories = [defaultDirectory, ...validDirectories]
    const prefixes = [path.resolve(cacheDirectory), 
      ...directories.map(dir => path.resolve(filePrefix, dir))
    ]
    const valid = prefixes.some(prefix => resolved.startsWith(prefix))

    if (!valid) throw Errors.invalid.url + resolved

    graphFile.resolved = resolved
    return resolved
    
  }


  protected loadGraphFilePromise(graphFile: GraphFile): Promise<any> {
    let cache = this.cacheGet(graphFile, true)
    assertObject(cache)

    const { definition } = graphFile
    if (isDefinition(definition)) {
      const { definitions } = cache 
      if (!definitions.includes(definition)) definitions.push(definition)
    }
    const { promise } = cache
    assertObject(promise)

    return promise
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

  private typeExtension(type: LoadType): string {
    switch(type){
      case LoadType.Font: return '.ttf'
      case LoadType.Image: return '.png'
      case LoadType.Audio: return '.mp3'
      case LoadType.Video: return '.mp4'
    }
  }
  private updateableDefinitions(preloaderSource: LoaderCache): Definition[] {
    const definitions = [...preloaderSource.definitions]
    const preloadableDefinitions = definitions.filter(definition => {
      return isPreloadableDefinition(definition) 
    })

    return preloadableDefinitions.filter(definition => {
      const trimmable = isUpdatableDurationDefinition(definition)
      if (trimmable && !isAboveZero(definition.duration)) return true

      return isUpdatableSizeDefinition(definition) && !sizeAboveZero(definition.sourceSize)
    })
  }

  private updateSources(key: string, cache: LoaderCache, graphFile: GraphFile): Promise<any> {
    const { definitions } = cache
    cache.loaded = true
    definitions.forEach(definition => {
      if (!isPreloadableDefinition(definition)) return

      if (!definition.source.startsWith('http')) {
        definition.source = key
      }
      return 
    })

    const { type } = graphFile
    if (!isLoadType(type)) return Promise.resolve()

    const neededDefinitions = this.updateableDefinitions(cache)
        // console.log(this.constructor.name, "updateSources", neededDefinitions.length)

    if (!neededDefinitions.length) return Promise.resolve()

    // const preloaderFile = cache as LoaderCache

    const infoPath = this.infoPath(key) 
    // console.log(this.constructor.name, "updateSources", infoPath)
    return probingInfoPromise(key, infoPath).then(loadedInfo => { 

      this.updateDefinitions(graphFile, loadedInfo) 
    })
  }

  private writePromise(graphFile: GraphFile, key: string): Promise<void> {
    const { file, type, content } = graphFile
    const dirname = path.dirname(key)
    let promise = fs.promises.mkdir(dirname, { recursive: true }).then(EmptyMethod)

    if (isLoadType(type)) {
      if (file.startsWith('http')) {
        return promise.then(() => this.remotePromise(key, file))
      } 
      // local file should already exist!
      throw Errors.uncached + file 
    } 
    assertPopulatedString(content)
    
    switch(type) {
      case GraphFileType.SvgSequence: return promise.then(() => {
        const svgs = content.split("\n")
        const { length } = svgs
        const digits = String(length).length
        return Promise.all(svgs.map((svg, index) => {
          const fileName = `${String(index).padStart(digits, '0')}.svg`
          const filePath = path.join(dirname, fileName)
          return fs.promises.writeFile(filePath, svg)
        })).then(EmptyMethod)
      })
      
    }
    return promise.then(() => fs.promises.writeFile(key, content))
  }
}
