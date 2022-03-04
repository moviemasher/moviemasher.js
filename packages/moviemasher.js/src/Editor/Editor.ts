import { Endpoint, Size, VisibleContextData } from "../declarations"
import { Emitter } from "../Helpers/Emitter"
import { PropertiedChangeHandler } from "../Base/Propertied"
import { EditType } from "../Setup/Enums"
import { BrowserPreloaderClass } from "../Preloader/BrowserPreloaderClass"

interface EditorOptions {
  preloader?: BrowserPreloaderClass
  endpoint?: Endpoint
}

interface Editor {
  change: PropertiedChangeHandler
  editType: EditType
  eventTarget: Emitter
  imageData: VisibleContextData
  imageSize: Size
  preloader: BrowserPreloaderClass
}

export { Editor, EditorOptions }
