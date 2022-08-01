import { GraphFile, GraphFiles } from "../MoveMe"
import { Errors } from "../Setup/Errors"
import { Loader, LoaderFile } from "./Loader"
import { Definition } from "../Definition/Definition"
import { assertAboveZero, assertBoolean, isAboveZero } from "../Utility/Is"
import { isUpdatableSizeDefinition } from "../Mixin/UpdatableSize/UpdatableSize"
import { isUpdatableDurationDefinition } from "../Mixin/UpdatableDuration/UpdatableDuration"
import { UnknownObject } from "../declarations"
import { isPreloadableDefinition } from "../Mixin"
import { assertFontDefinition, isFontDefinition } from "../Media/Font/Font"

export class LoaderClass implements Loader {
  protected filePromise(key: string, graphFile: GraphFile): LoaderFile {
    throw Errors.unimplemented + 'filePromise'
  }

  protected files = new Map<string, LoaderFile>()

  flushFilesExcept(graphFiles: GraphFiles = []): void {
    const retainKeys = graphFiles.map(graphFile => this.key(graphFile))
    const keys = [...this.files.keys()]
    const removeKeys = keys.filter(key => !retainKeys.includes(key))
    removeKeys.forEach(key => {
      const preloaderFile = this.files.get(key)
      if (preloaderFile) this.files.delete(key)
    })
  }

  getFile(graphFile: GraphFile): any {
    const key = this.key(graphFile)
    const preloaderFile = this.files.get(key)
    return preloaderFile?.result
  }

  key(graphFile: GraphFile): string { throw Errors.unimplemented + 'key' }

  private loadFilePromise(graphFile: GraphFile): Promise<GraphFile> {
    const key = this.key(graphFile)
    const { definition } = graphFile
    if (isPreloadableDefinition(definition) || isFontDefinition(definition)) {
      definition.urlAbsolute ||= key
    }

    let file = this.files.get(key)
    const definitions = file?.definitions || new Map<string, Definition>()
    definitions.set(definition.id, definition)

    if (!file) {
      file = this.filePromise(key, graphFile)
      this.files.set(key, file)
    }
    return file.promise.then(() => graphFile)
  }

  loadFilesPromise(graphFiles: GraphFiles): Promise<GraphFiles> {
    // console.log(this.constructor.name, "loadFilesPromise", graphFiles.length)
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

  protected updateDefinitionSize(definition: Definition, size: UnknownObject) {
    // console.log(this.constructor.name, "updateDefinitionSize")
    if (!isUpdatableSizeDefinition(definition)) return 
    
    const { width: definitionWidth, height: definitionHeight } = definition
    const { width: sourceWidth, height: sourceHeight } = size

      // console.log(this.constructor.name, "updateDefinitionSize", definitionWidth, "x", definitionHeight, "=>", sourceWidth, "x", sourceHeight)
    if (!isAboveZero(definitionWidth)) {
      assertAboveZero(sourceWidth, 'source width')
      definition.width = sourceWidth
    }
    
    if (!isAboveZero(definitionHeight)) {
      assertAboveZero(sourceHeight, 'source height')
      definition.height = sourceHeight
    }
  }

  protected updateDefinitionFamily(definition: Definition, family: string) {
    if (!isFontDefinition(definition)) return
    
    definition.family = family
  }
}
