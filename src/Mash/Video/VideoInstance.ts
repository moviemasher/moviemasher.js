import { Video, VideoDefinition, VideoObject } from "./Video"
import { InstanceClass } from "../Instance/Instance"
import { ClipMixin } from "../Mixin/Clip/ClipMixin"
import { VisibleMixin } from "../Mixin/Visible/VisibleMixin"
import { TransformableMixin } from "../Mixin/Transformable/TransformableMixin"
import { AudibleMixin } from "../Mixin/Audible/AudibleMixin"
import { Is } from "../../Utilities/Is"
import { Default } from "../../Setup/Default"
import { Any, JsonObject } from "../../Setup/declarations"
import { Time } from "../../Utilities/Time"

const VideoWithClip = ClipMixin(InstanceClass)
const VideoWithAudible = AudibleMixin(VideoWithClip)
const VideoWithVisible = VisibleMixin(VideoWithAudible)
const VideoWithTransformable = TransformableMixin(VideoWithVisible)

class VideoClass extends VideoWithTransformable {
  constructor(...args : Any[]) {
    super(...args)
    const [object] = args
    const { speed } = <VideoObject> object
    if (speed && Is.aboveZero(speed)) this.speed = speed
  }

  get copy() : Video { return <Video> super.copy }

  definition! : VideoDefinition

  definitionTime(quantize : number, time : Time) : Time {
    const scaledTime = super.definitionTime(quantize, time)
    if (this.speed === Default.clip.video.speed) return scaledTime

    return scaledTime.divide(this.speed) //, 'ceil')
  }

  speed = Default.clip.video.speed

  toJSON() : JsonObject {
    const object = super.toJSON()
    if (this.speed !== Default.clip.video.speed) object.speed = this.speed
    return object
  }

}

export { VideoClass }
