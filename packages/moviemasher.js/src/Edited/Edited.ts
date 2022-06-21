import { Described, UnknownObject } from "../declarations"
import { Dimensions } from "../Setup/Dimensions"
import { GraphFileOptions, GraphFiles } from "../MoveMe"
import { Propertied } from "../Base/Propertied"
import { Emitter } from "../Helpers/Emitter"
import { Loader } from "../Loader/Loader"
import { PreviewOptions } from "../Editor/Preview/Preview"

export interface EditedDescription extends UnknownObject, Described { }

export interface EditedObject extends Partial<EditedDescription> {
  backcolor?: string
  buffer?: number
  quantize?: number
}

export interface EditedArgs extends EditedObject {
  preloader?: Loader
}

export interface Edited extends Described, Propertied {
  backcolor: string
  buffer: number
  destroy(): void
  emitter?: Emitter
  imageSize: Dimensions
  loading: boolean
  readonly preloader: Loader
  svgElement(graphArgs: PreviewOptions): SVGSVGElement
  reload(): Promise<void> | undefined
  quantize: number
  loadPromise(args?: GraphFileOptions): Promise<void>
  graphFiles(args?: GraphFileOptions): GraphFiles
}
