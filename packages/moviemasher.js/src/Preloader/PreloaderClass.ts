import { Any, GraphFile, GraphFiles } from "../declarations"
import { GraphType } from "../Setup/Enums"
import { Errors } from "../Setup/Errors"
import { LoadedInfo, Preloader, PreloaderFile, PreloaderSource } from "./Preloader"
import { PreloadableDefinition } from "../Base/PreloadableDefinition"
import { Definition } from "../Base/Definition"

class PreloaderClass implements Preloader {
  fileInfoPromise(graphFile: GraphFile): Promise<LoadedInfo> {
    if (!this.loadedFile(graphFile)) throw Errors.uncached

    const gotFile = this.getFile(graphFile)
    if (!gotFile) throw Errors.internal + 'fileInfoPromise'

    const { height, width, duration } = gotFile

    const loadedInfo: LoadedInfo = {}
    if (height && width) {
      loadedInfo.height = Number(height)
      loadedInfo.width = Number(width)
    }
    if (duration) loadedInfo.duration = Number(duration)

    return Promise.resolve(loadedInfo)
  }

  protected filePromise(key: string, graphFile: GraphFile): PreloaderFile {
    throw Errors.unimplemented + 'filePromise'
  }

  protected files = new Map<string, PreloaderFile>()

  flushFilesExcept(graphFiles: GraphFiles = []): void {
    const retainKeys = graphFiles.map(graphFile => this.key(graphFile))
    const keys = [...this.files.keys()]
    const removeKeys = keys.filter(key => !retainKeys.includes(key))
    removeKeys.forEach(key => {
      const preloaderFile = this.files.get(key)
      if (preloaderFile) this.files.delete(key)
    })
  }

  getFile(graphFile: GraphFile): Any {
    const key = this.key(graphFile)
    const preloaderFile = this.files.get(key)
    return preloaderFile?.result
  }

  graphType = GraphType.Canvas

  key(graphFile: GraphFile): string { throw Errors.unimplemented + 'key' }

  loadFilePromise(graphFile: GraphFile): Promise<GraphFile> {
    const key = this.key(graphFile)
    const { definition } = graphFile
    let file = this.files.get(key)
    const definitions = file?.definitions || new Map<string, Definition>()
    if (definition) definitions.set(definition.id, definition)

    if (!file) {
      file = this.filePromise(key, graphFile)
      this.files.set(key, file)
    }
    return file.promise.then(() => graphFile)
  }

  loadFilesPromise(graphFiles: GraphFiles): Promise<GraphFiles> {
    return Promise.all(graphFiles.map(graphFile => this.loadFilePromise(graphFile)))
  }

  loadedFile(graphFile: GraphFile): boolean {
    const key = this.key(graphFile)
    const file = this.files.get(key)
    if (!file) return false

    return !!file.loaded
  }

  loadingFile(graphFile: GraphFile): boolean {
    const key = this.key(graphFile)
    const file = this.files.get(key)
    if (!file) return false

    return !file.loaded
  }

  protected updateSources(key: string, preloaderSource: PreloaderSource): void {
    if (!preloaderSource) {
      console.warn(this.constructor.name, "updateSources no PreloaderSource", key)
      return
    }
    preloaderSource.loaded = true
    preloaderSource.definitions.forEach(definition => {
      if (definition instanceof PreloadableDefinition) {
        if (!definition.source.startsWith('http')) definition.source = key
      } else console.warn(this.constructor.name, "updateSources definition not preloadable", key)
    })
  }
}

export { PreloaderClass }
