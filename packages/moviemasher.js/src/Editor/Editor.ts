import { Endpoint, Size, VisibleContextData } from "../declarations"
import { Emitter } from "../Helpers/Emitter"
import { PropertiedChangeHandler } from "../Base/Propertied"
import { EditType } from "../Setup/Enums"
import { Preloader } from "../Preloader/Preloader"

interface EditorOptions {
  endpoint?: Endpoint
}

interface Editor {
  change: PropertiedChangeHandler
  editType: EditType
  eventTarget: Emitter
  imageData: VisibleContextData
  imageSize: Size
  preloader: Preloader
  // output?: Output
}

export { Editor, EditorOptions }
