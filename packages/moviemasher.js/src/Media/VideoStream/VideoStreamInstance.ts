import { VideoStream, VideoStreamDefinition } from "./VideoStream"
import { InstanceBase } from "../../Base/Instance"
import { ClipMixin } from "../../Mixin/Clip/ClipMixin"
import { TransformableMixin } from "../../Mixin/Transformable/TransformableMixin"
import { AudibleMixin } from "../../Mixin/Audible/AudibleMixin"
import { UnknownObject } from "../../declarations"
import { VisibleMixin } from "../../Mixin/Visible/VisibleMixin"
import { StreamableMixin } from "../../Mixin/Streamable/StreamableMixin"

const ClipVideoStream = ClipMixin(InstanceBase)
const AudibleVideoStream = AudibleMixin(ClipVideoStream)
const StreamableVideoStream = StreamableMixin(AudibleVideoStream)
const VisibleVideoStream = VisibleMixin(StreamableVideoStream)
const TransformableVideoStream = TransformableMixin(VisibleVideoStream)

export class VideoStreamClass extends TransformableVideoStream implements VideoStream {
  get copy() : VideoStream { return <VideoStream> super.copy }

  declare definition : VideoStreamDefinition

  toJSON() : UnknownObject {
    const object = super.toJSON()
    // if (this.speed !== Default.instance.video.speed) object.speed = this.speed
    return object
  }
}
