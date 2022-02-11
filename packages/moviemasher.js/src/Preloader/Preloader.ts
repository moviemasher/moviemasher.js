import { Any, GraphFile, LoadPromise } from "../declarations"
import { GraphType } from "../Setup/Enums"

interface Preloader {
  graphType: GraphType
  getFile(file : GraphFile): Any
  key(file : GraphFile): string
  loadFilePromise(file : GraphFile): Promise<GraphFile>
  loadFilesPromise(files : GraphFile[]): Promise<GraphFile[]>
  loadedFile(file : GraphFile): boolean
  loadingFile(file : GraphFile): boolean
  loadingFilePromise(file : GraphFile): LoadPromise
}

export { Preloader }
