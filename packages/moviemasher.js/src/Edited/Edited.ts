import { Described, SvgItem, UnknownObject } from "../declarations"
import { Size } from "../Utility/Size"
import { GraphFileOptions, GraphFiles } from "../MoveMe"
import { Propertied } from "../Base/Propertied"
import { Emitter } from "../Helpers/Emitter"
import { Loader } from "../Loader/Loader"
import { PreviewOptions } from "./Mash/Preview/Preview"
import { Editor } from "../Editor/Editor"
import { Selectable } from "../Editor/Selectable"
import { isMash, Mash } from "./Mash/Mash"
import { isCast } from "./Cast"
import { throwError } from "../Utility/Throw"

export interface EditedDescription extends UnknownObject, Described { }

export interface EditedObject extends Partial<EditedDescription> {
  color?: string
  buffer?: number
  quantize?: number
}

export interface EditedArgs extends EditedObject {
  preloader?: Loader
}

export interface Edited extends Described, Propertied, Selectable {
  color: string
  buffer: number
  destroy(): void
  editor: Editor
  emitter: Emitter
  editedGraphFiles(args?: GraphFileOptions): GraphFiles
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

export const isEdited = (value: any): value is Edited => {
  return isMash(value) || isCast(value)
}
export function assertEdited(value: any): asserts value is Edited {
  if (!isEdited(value)) throwError(value, 'Edited')
}