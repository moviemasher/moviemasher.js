import { Described, Size, UnknownObject, VisibleSources } from "../declarations"
import { Propertied } from "../Base/Propertied"
import { Emitter } from "../Helpers/Emitter"
import { Preloader } from "../Preloader/Preloader"
import { EditorDefinitions } from "../Editor/EditorDefinitions/EditorDefinitions"
import { VisibleContext } from "../Context/VisibleContext"


export interface EditedDescription extends UnknownObject, Described { }

export interface EditedObject extends Partial<EditedDescription> {}

export interface EditedArgs extends EditedObject {
  preloader?: Preloader
  definitions?: EditorDefinitions
}

export interface Edited extends Described, Propertied {
  backcolor: string
  buffer: number
  destroy(): void
  emitter?: Emitter
  imageSize: Size
  loading: boolean
  readonly definitions: EditorDefinitions
  readonly visibleContext: VisibleContext
  readonly preloader: Preloader
  drawBackground(): void

  visibleContexts: VisibleContext[]
  visibleSources: VisibleSources
}
