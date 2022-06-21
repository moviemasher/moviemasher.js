import { Dimensions } from "../Setup/Dimensions"
import { GraphFile, GraphFiles } from "../MoveMe"
import { Errors } from "../Setup/Errors"
import { Loader, LoaderFile } from "./Loader"
import { Definition } from "../Definition/Definition"
import { isAboveZero } from "../Utility/Is"
import { isUpdatableDimensionsDefinition } from "../Mixin/UpdatableDimensions/UpdatableDimensions"
import { isUpdatableDurationDefinition } from "../Mixin/UpdatableDuration/UpdatableDuration"

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

  loadFilePromise(graphFile: GraphFile): Promise<GraphFile> {
    const key = this.key(graphFile)
    const { definition } = graphFile
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


  updateDefinitionDuration(definition: Definition, value: number) {
    if (isUpdatableDurationDefinition(definition)) {
      const { duration } = definition
      if (!isAboveZero(duration)) definition.duration = value
    }
  }

  updateDefinitionDimensions(definition: Definition, size: Dimensions) {
    if (isUpdatableDimensionsDefinition(definition)) {
      const { width, height } = definition
      if (!isAboveZero(width)) definition.width = size.width
      if (!isAboveZero(height)) definition.height = size.height
    }
  }

}
