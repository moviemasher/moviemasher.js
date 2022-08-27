import { Described, SvgItem, UnknownObject } from "../declarations"
import { Size } from "../Utility/Size"
import { GraphFileOptions, GraphFiles } from "../MoveMe"
import { Propertied } from "../Base/Propertied"
import { Emitter } from "../Helpers/Emitter"
import { Loader } from "../Loader/Loader"
import { PreviewOptions } from "../Editor/Preview/Preview"
import { Editor } from "../Editor/Editor"
import { Selectable } from "../Editor/Selectable"
import { Mash } from "./Mash/Mash"

export interface EditedDescription extends UnknownObject, Described { }

export interface EditedObject extends Partial<EditedDescription> {
  backcolor?: string
  buffer?: number
  quantize?: number
}

export interface EditedArgs extends EditedObject {
  preloader?: Loader
}

export interface Edited extends Described, Propertied, Selectable {
  backcolor: string
  buffer: number
  destroy(): void
  editor: Editor
  emitter: Emitter
  graphFiles(args?: GraphFileOptions): GraphFiles
  imageSize: Size
  loading: boolean
  loadPromise(args?: GraphFileOptions): Promise<void>
  mashes: Mash[]
  readonly preloader: Loader
  putPromise(): Promise<void>
  quantize: number
  reload(): Promise<void> | undefined
  svgItems(options: PreviewOptions): Promise<SvgItem[]>
}
