import { Endpoint, SelectedProperties, Size, VisibleContextData } from "../declarations"
import { Emitter } from "../Helpers/Emitter"
// import { PropertiedChangeHandler } from "../Base/Propertied"
import { EditType } from "../Setup/Enums"
import { BrowserPreloaderClass } from "../Preloader/BrowserPreloaderClass"
import { Edited } from "../Edited/Edited"

interface EditorOptions {
  preloader?: BrowserPreloaderClass
  endpoint?: Endpoint
}

interface Editor {
  edited: Edited
  editType: EditType
  eventTarget: Emitter
  imageData: VisibleContextData
  imageSize: Size
  preloader: BrowserPreloaderClass
  selectedProperties: SelectedProperties
}

export { Editor, EditorOptions }
