import { Described, PreviewItems, SvgItem, UnknownObject } from "../declarations"
import { Size } from "../Utility/Size"
import { PreloadOptions, GraphFiles } from "../MoveMe"
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
  editedGraphFiles(args?: PreloadOptions): GraphFiles
  imageSize: Size
  loading: boolean
  loadPromise(args?: PreloadOptions): Promise<void>
  mashes: Mash[]
  readonly preloader: Loader
  putPromise(): Promise<void>
  quantize: number
  reload(): Promise<void> | undefined
  previewItemsPromise(editor?: Editor): Promise<PreviewItems>
}

export const isEdited = (value: any): value is Edited => {
  return isMash(value) || isCast(value)
}

export function assertEdited(value: any): asserts value is Edited {
  if (!isEdited(value)) throwError(value, 'Edited')
}