import { Endpoint, SelectedProperties, Size, VisibleContextData } from "../declarations"
import { Emitter } from "../Helpers/Emitter"
import { EditType, MasherAction } from "../Setup/Enums"
import { BrowserPreloaderClass } from "../Preloader/BrowserPreloaderClass"
import { Edited } from "../Edited/Edited"
import { DataCastGetResponse, DataMashGetResponse } from "../Api/Data"
import { EditorDefinitions } from "./EditorDefinitions"

export interface EditorOptions {
  preloader?: BrowserPreloaderClass
  endpoint?: Endpoint
}

export interface Editor {
  can(action: MasherAction): boolean
  clear(): void
  definitions: EditorDefinitions
  edited: Edited
  editType: EditType
  eventTarget: Emitter
  imageData: VisibleContextData
  imageSize: Size
  loadData(data: DataMashGetResponse | DataCastGetResponse): void
  preloader: BrowserPreloaderClass
  selectedProperties: SelectedProperties
}
