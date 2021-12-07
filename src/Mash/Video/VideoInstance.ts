import { Video, VideoClass, VideoDefinition, VideoObject } from "./Video"
import { InstanceBase } from "../../Base/Instance"
import { ClipMixin } from "../../Mixin/Clip/ClipMixin"
import { TransformableMixin } from "../../Mixin/Transformable/TransformableMixin"
import { AudibleMixin } from "../../Mixin/Audible/AudibleMixin"
import { Is } from "../../Utilities/Is"
import { Default } from "../../Setup/Default"
import { Any, JsonObject } from "../../declarations"
import { Time } from "../../Utilities/Time"
import { AudibleFileMixin } from "../../Mixin/AudibleFile/AudibleFileMixin"
import { VisibleMixin } from "../../Mixin/Visible/VisibleMixin"
// import { Errors } from "../../Setup/Errors"

const WithClip = ClipMixin(InstanceBase)
const WithAudible = AudibleMixin(WithClip)
const WithAudibleFile = AudibleFileMixin(WithAudible)
const WithVisible = VisibleMixin(WithAudibleFile)
const WithTransformable = TransformableMixin(WithVisible)

const VideoClassImplementation: VideoClass = class extends WithTransformable {
  constructor(...args : Any[]) {
    super(...args)
    const [object] = args
    const { speed } = <VideoObject> object
    if (speed && Is.aboveZero(speed)) this.speed = speed
  }

  // private loadedAudio? : LoadedAudio

  get copy() : Video { return <Video> super.copy }

  declare definition : VideoDefinition

  definitionTime(quantize : number, time : Time) : Time {
    const scaledTime = super.definitionTime(quantize, time)
    if (this.speed === Default.instance.video.speed) return scaledTime

    return scaledTime.divide(this.speed) //, 'ceil')
  }

  speed = Default.instance.video.speed

  toJSON() : JsonObject {
    const object = super.toJSON()
    if (this.speed !== Default.instance.video.speed) object.speed = this.speed
    return object
  }
}

export { VideoClassImplementation }
