import { Size, VisibleContextData } from "../declarations"
import { Emitter } from "../Helpers/Emitter"
import { PropertiedChangeHandler } from "../Base/Propertied"
import { Output } from "../Output/Output"
import { EditType } from "../Setup/Enums"

interface Editor {
  change: PropertiedChangeHandler
  eventTarget: Emitter
  imageData: VisibleContextData
  imageSize: Size
  output?: Output
  editType: EditType
}

export { Editor }
