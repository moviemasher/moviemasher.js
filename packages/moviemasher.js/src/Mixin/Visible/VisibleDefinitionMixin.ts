import { VisibleSource } from "../../declarations"
import { TrackType } from "../../Setup/Enums"
import { ClipDefinitionClass } from "../Clip/Clip"
import { VisibleDefinitionClass } from "./Visible"

function VisibleDefinitionMixin<T extends ClipDefinitionClass>(Base: T) : VisibleDefinitionClass & T {
  return class extends Base {
    loadedVisible(): VisibleSource | undefined { return }

    trackType = TrackType.Video

    visible = true
  }
}

export { VisibleDefinitionMixin }
