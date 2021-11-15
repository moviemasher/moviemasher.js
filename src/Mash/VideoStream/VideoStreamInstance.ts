import { VideoStream, VideoStreamDefinition, VideoStreamObject } from "./VideoStream"
import { InstanceBase } from "../Instance/Instance"
import { ClipMixin } from "../Mixin/Clip/ClipMixin"
import { TransformableMixin } from "../Mixin/Transformable/TransformableMixin"
import { AudibleMixin } from "../Mixin/Audible/AudibleMixin"
import { Any, JsonObject } from "../../declarations"
import { VisibleMixin } from "../Mixin/Visible/VisibleMixin"
import { StreamableMixin } from "../Mixin/Streamable/StreamableMixin"

const WithClip = ClipMixin(InstanceBase)
const WithAudible = AudibleMixin(WithClip)
const WithStreamable = StreamableMixin(WithAudible)
const WithVisible = VisibleMixin(WithStreamable)
const WithTransformable = TransformableMixin(WithVisible)

class VideoStreamClass extends WithTransformable {
  constructor(...args : Any[]) {
    super(...args)
    // const [object] = args
    // const { speed } = <VideoStreamObject> object
  }

  get copy() : VideoStream { return <VideoStream> super.copy }

  declare definition : VideoStreamDefinition

  toJSON() : JsonObject {
    const object = super.toJSON()
    // if (this.speed !== Default.instance.video.speed) object.speed = this.speed
    return object
  }
}

export { VideoStreamClass }
