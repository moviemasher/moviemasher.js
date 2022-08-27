import { GraphFile, GraphFiles } from "../MoveMe"
import { Errors } from "../Setup/Errors"
import { LoadedInfo, Loader, LoaderFile } from "./Loader"
import { Definition, DefinitionObject } from "../Definition/Definition"
import { assertAboveZero, assertBoolean, isAboveZero } from "../Utility/Is"
import { isUpdatableSizeDefinition } from "../Mixin/UpdatableSize/UpdatableSize"
import { isUpdatableDurationDefinition } from "../Mixin/UpdatableDuration/UpdatableDuration"
import { UnknownObject } from "../declarations"
import { isPreloadableDefinition, PreloadableDefinition } from "../Mixin"
import { isFontDefinition } from "../Media/Font/Font"
import { idGenerate, sizeAboveZero, sizesEqual } from "../Utility"

export class LoaderClass implements Loader {
  protected filePromise(key: string, graphFile: GraphFile): LoaderFile {
    throw Errors.unimplemented + 'filePromise'
  }

  private files = new Map<string, LoaderFile>()

  flushFilesExcept(graphFiles: GraphFiles = []): void {
    const retainKeys = graphFiles.map(graphFile => {
      const { type } = graphFile
      const key = this.key(graphFile)
      const filesKey = `${type}-${key}`
      return filesKey
    })
    const keys = [...this.files.keys()]
    const removeKeys = keys.filter(key => !retainKeys.includes(key))
    removeKeys.forEach(key => {
      const preloaderFile = this.files.get(key)
      if (preloaderFile) this.files.delete(key)
    })
  }

  getFile(graphFile: GraphFile): any {
    const { type } = graphFile
    const key = this.key(graphFile)
    const filesKey = `${type}-${key}`
    const preloaderFile = this.files.get(filesKey)
    return preloaderFile?.result
  }

  key(graphFile: GraphFile): string { throw Errors.unimplemented + 'key' }

  loadDefinitionObject(definition: DefinitionObject, object: any, loadedInfo?: LoadedInfo, key?: string): string {
    const id = key || idGenerate('object:')
    definition.url ||= id

    const { loadType } = definition
    const loaderFile: LoaderFile = {
      definitions: [], result: object, loaded: true, loadedInfo
    }
    const filesKey = `${loadType}-${id}`
    this.files.set(filesKey, loaderFile)
    return id
  }

  private loadFilePromise(graphFile: GraphFile): Promise<GraphFile> {
    const { definition, type } = graphFile
    const key = this.key(graphFile)
    const filesKey = `${type}-${key}`
    if (isPreloadableDefinition(definition) || isFontDefinition(definition)) {
      definition.urlAbsolute ||= key
    }
    let file = this.files.get(filesKey)
    const definitions = file?.definitions || []
    if (!definitions.includes(definition)) definitions.push(definition)
    
    if (!file) {
      file = this.filePromise(key, graphFile)
      this.files.set(filesKey, file)
    }

    return file.promise!.then(() => graphFile)
  }

  loadFilesPromise(graphFiles: GraphFiles): Promise<GraphFiles> {
    // console.log(this.constructor.name, "loadFilesPromise", graphFiles.length)
    return Promise.all(graphFiles.map(graphFile => this.loadFilePromise(graphFile)))
  }

  loadedFile(graphFile: GraphFile): boolean {
    const key = this.key(graphFile)
    const { type } = graphFile
    const filesKey = `${type}-${key}`
    
    const file = this.files.get(filesKey)
    if (!file) return false

    return !!file.loaded
  }

  loadingFile(graphFile: GraphFile): boolean {
    const key = this.key(graphFile)
    const { type } = graphFile
    const filesKey = `${type}-${key}`
    const file = this.files.get(filesKey)
    if (!file) return false

    return !file.loaded
  }

  protected updateDefinitionDuration(definition: Definition, durationOrNot?: number, audioOrNot?: boolean) {
    // console.log(this.constructor.name, "updateDefinitionDuration", definition.id, durationOrNot, audioOrNot)
   if (!isUpdatableDurationDefinition(definition)) return
    
    const { duration, audio } = definition
    if (!isAboveZero(duration)) {
      assertAboveZero(durationOrNot)
      // console.log(this.constructor.name, "updateDefinitionDuration duration", duration, "=>", durationOrNot)
      definition.duration = durationOrNot
    }
    if (!audio) {
      assertBoolean(audioOrNot)
      // console.log(this.constructor.name, "updateDefinitionDuration audio", audio, "=>", audioOrNot)
      definition.audio = audioOrNot
    }
  }

  protected updateDefinitionSize(definition: Definition, size: UnknownObject, source = false) {
    
    // return unless definition's size updatable
    if (!isUpdatableSizeDefinition(definition)) return 

    // return unless provided size is valid
    if (!sizeAboveZero(size)) return

    const key = source ? "sourceSize" : "previewSize"
    const { [key]: definitionSize} = definition

    console.log(this.constructor.name, "updateDefinitionSize", key, definitionSize, "=>", size)

    // return if definition's size already matches
    if (sizesEqual(size, definitionSize)) return 

    // console.log(this.constructor.name, "updateDefinitionSize", key, definitionSize, "=>", size)
    definition[key] = size
  }

  protected updateDefinitionFamily(definition: Definition, family: string) {
    if (!isFontDefinition(definition)) return
    
    definition.family = family
  }
}
