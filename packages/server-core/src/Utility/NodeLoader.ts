import fs from 'fs'
import http from 'http'
import https from 'https'
import path from 'path'


import {
  EmptyMethod, GraphFile, GraphType, isPreloadableDefinition, assertObject, 
  Errors, LoaderClass, GraphFileType, LoaderCache, Definition, urlIsHttp,
  isAboveZero, isLoadType, assertPopulatedString, isUpdatableDurationDefinition, 
  isUpdatableSizeDefinition, PopulatedString, sizeAboveZero, Loaded, LoadType, 
  isDefinition, isPopulatedString, LoadedInfo, isString, ContentTypeCss
} from '@moviemasher/moviemasher.js'

import { BasenameCache, ExtensionLoadedInfo } from '../Setup/Constants'
import { Probe } from '../Command/Probe/Probe'
import { hashMd5 } from './Hash'


export class NodeLoader extends LoaderClass {
  constructor(
    public cacheDirectory: string,
    public filePrefix: string,
    public defaultDirectory: string,
    public temporaryDirectory: string,
    public validDirectories: string[]
  ) {
    super()
    if (!cacheDirectory) throw Errors.invalid.url + 'cacheDirectory'
    if (!filePrefix) throw Errors.invalid.url + 'filePrefix'
    if (!defaultDirectory) throw Errors.invalid.url + 'defaultDirectory'
  }

  protected override browsing = false


  private cacheGet(graphFile: GraphFile, createIfNeeded?: boolean): LoaderCache | undefined {
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
      cache.error = error
      cache.loaded = true
      return error
    })
    return cache
  }


  // protected cachePromise(key: string, graphFile: GraphFile, cache: LoaderCache): Promise<Loaded> {
  //   const cacheKey = this.cacheKey(graphFile)
  //   const loaderFile: LoaderFile = {
  //     loaderPath: cacheKey, urlOrLoaderPath: key, loaderType: graphFile.type
  //   }
  //   return this.filePromise(loaderFile)
  // }

  private cachePromise(url: string, graphFile: GraphFile, cache: LoaderCache): Promise<Loaded> {
    if (fs.existsSync(url)) {
      return this.updateSources(url, cache, graphFile)
    } 
    
    const { filePrefix } = this
    assertPopulatedString(url, 'cachePromise url')
    if (url.startsWith(filePrefix)) throw Errors.uncached + url + ' ' + filePrefix

    return this.writePromise(graphFile, url).then(() => {
      return this.updateSources(url, cache, graphFile)
    })
  }


  private cacheSet(graphFile: GraphFile | string, cache: LoaderCache) {
    const key = isString(graphFile) ? graphFile: this.cacheKey(graphFile) 
    this.loaderCache.set(key, cache)
  }

  graphType = GraphType.Mash

  private graphFileTypeBasename(type: GraphFileType, content: PopulatedString) {
    if (type !== GraphFileType.SvgSequence) return `${BasenameCache}.${type}`
    const fileCount = content.split("\n").length
    const digits = String(fileCount).length
    return `%0${digits}.svg`
  }

  // RenderingProcessClass
  infoPath(key: string): string {
    return path.join(this.cacheDirectory, `${hashMd5(key)}.${ExtensionLoadedInfo}`)
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

  
    // file is url, if absolute then use hashMd5 as directory name
    if (file.includes('://')) {
      // console.log(this.constructor.name, "key LOADTYPE ABSOLUTE", type, file, content)
      const extname = path.extname(file)
      const ext = extname || this.typeExtension(type)
      return path.resolve(
        cacheDirectory, hashMd5(file), `${BasenameCache}${ext}`
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

  // called by super.loadFilesPromise
  protected loadGraphFilePromise(graphFile: GraphFile): Promise<any> {
    let cache = this.cacheGet(graphFile, true)
    assertObject(cache, 'cache')

    const { definition } = graphFile
    if (isDefinition(definition)) {
      const { definitions } = cache 
      if (!definitions.includes(definition)) definitions.push(definition)
    }
    const { promise } = cache
    assertObject(promise, 'promise')

    return promise
  }

  private remoteLocalFile(originalFile: string, loadType: LoadType, mimeType?: string): string {
    if (!isPopulatedString(mimeType) || mimeType.startsWith(loadType)) return originalFile
    if (!(loadType === LoadType.Font && mimeType.startsWith(ContentTypeCss))) return originalFile
    
    const dirname = path.dirname(originalFile)
    const extname = path.extname(originalFile)
    const basename = path.basename(originalFile, extname)
    return path.join(dirname, `${basename}.css`)
  }
  private remotePromise(loadType: LoadType, key: string, urlString: string): Promise<void> {
    // console.log(this.constructor.name, "remotePromise", key, urlString)
    const promise: Promise<void> = new Promise((resolve, reject) => {
      const { request } = urlString.startsWith('https') ? https : http
      const options: http.RequestOptions = {}
      const req = request(urlString, response => {
        const { ['content-type']: type } = response.headers
        const filePath = this.remoteLocalFile(key, loadType, type)
        // console.log(this.constructor.name, "remotePromise.request", type, filePath)
        const stream = fs.createWriteStream(filePath)
        response.pipe(stream)
        stream.on('finish', () => {
          stream.close()
          if (filePath === key) resolve()
          else {
            fs.promises.readFile(filePath).then(buffer => {
              const string = buffer.toString()
              const lastUrl = this.lastCssUrl(string)
              
              this.remotePromise(loadType, key, lastUrl).then(resolve)
            })
          }
        })
        stream.on('error', (error) => { 
          console.error(this.constructor.name, "remotePromise.callback error", error)
          reject(error) 
        })
      })
      req.on('error', error => {
        console.error(error)
        reject(error) 
      })
      req.end()
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


  private updateDefinitions(graphFile: GraphFile, info: LoadedInfo) {
    // console.log(this.constructor.name, "updateDefinitions", graphFile.file, info)

    const cache = this.cacheGet(graphFile)
    assertObject(cache, 'cache')
    this.updateCache(cache, info)
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
    const { temporaryDirectory } = this
    // console.log(this.constructor.name, "updateSources", infoPath)
    return Probe.promise(temporaryDirectory, key, infoPath).then(loadedInfo => { 
      this.updateDefinitions(graphFile, loadedInfo) 
    })
  }

  private writePromise(graphFile: GraphFile, key: string): Promise<void> {
    const { file, type, content } = graphFile
    const dirname = path.dirname(key)
    let promise = fs.promises.mkdir(dirname, { recursive: true }).then(EmptyMethod)

    console.log(this.constructor.name, "writePromise", key, type, file)
    if (isLoadType(type)) {
      if (urlIsHttp(file)) {
        // console.log(this.constructor.name, "writePromise calling remotePromise", type, key, file)
        return promise.then(() => this.remotePromise(type, key, file))
      } 
      // local file should already exist!
      throw Errors.uncached + ' NONEXISTENT ' + file + ' ' + key
    } 
    assertPopulatedString(content, 'content')
    
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
