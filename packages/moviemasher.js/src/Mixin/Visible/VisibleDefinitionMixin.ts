import { Size, VisibleSource } from "../../declarations"
import { Preloader } from "../../Preloader/Preloader"
import { TrackType } from "../../Setup/Enums"
import { ClipDefinitionClass } from "../Clip/Clip"
import { VisibleDefinitionClass } from "./Visible"

function VisibleDefinitionMixin<T extends ClipDefinitionClass>(Base: T) : VisibleDefinitionClass & T {
  return class extends Base {
    loadedVisible(): VisibleSource | undefined { return }

    size(preloader: Preloader): Size | undefined { return }

    trackType = TrackType.Video

    visible = true
  }
}

export { VisibleDefinitionMixin }
