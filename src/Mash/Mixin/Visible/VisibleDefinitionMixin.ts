import { TrackType } from "../../../Setup/Enums"
import { Constrained } from "../../../Setup/declarations"
import { ClipDefinition } from "../Clip/Clip"

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function VisibleDefinitionMixin<TBase extends Constrained<ClipDefinition>>(Base: TBase) {
  return class extends Base {
    trackType = TrackType.Video

    visible = true
  }
}

export { VisibleDefinitionMixin }
