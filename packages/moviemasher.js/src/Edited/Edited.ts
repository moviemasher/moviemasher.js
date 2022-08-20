import { Described, UnknownObject } from "../declarations"
import { Size } from "../Utility/Size"
import { GraphFileOptions, GraphFiles } from "../MoveMe"
import { SelectedItems } from "../Utility/SelectedProperty"
import { Propertied } from "../Base/Propertied"
import { Emitter } from "../Helpers/Emitter"
import { Loader } from "../Loader/Loader"
import { PreviewOptions, Svg, Svgs } from "../Editor/Preview/Preview"
import { SelectType } from "../Setup/Enums"
import { Actions } from "../Editor/Actions/Actions"
import { Editor } from "../Editor/Editor"
import { Selectable } from "../Editor/Selectable"

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
  putPromise(): Promise<void>
  quantize: number
  readonly preloader: Loader
  reload(): Promise<void> | undefined
  svg(graphArgs: PreviewOptions): Promise<Svg>
  svgs(graphArgs: PreviewOptions): Promise<Svgs>
}
