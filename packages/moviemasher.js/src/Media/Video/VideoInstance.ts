import { Video, VideoDefinition, VideoObject } from "./Video"
import { InstanceBase } from "../../Base/Instance"
import { ClipMixin } from "../../Mixin/Clip/ClipMixin"
import { TransformableMixin } from "../../Mixin/Transformable/TransformableMixin"
import { AudibleMixin } from "../../Mixin/Audible/AudibleMixin"
import { Is } from "../../Utility/Is"
import { Default } from "../../Setup/Default"
import { Any, FilterChain, FilterChainArgs, GraphFile, UnknownObject, ValueObject } from "../../declarations"
import { Time } from "../../Helpers/Time"
import { AudibleFileMixin } from "../../Mixin/AudibleFile/AudibleFileMixin"
import { VisibleMixin } from "../../Mixin/Visible/VisibleMixin"
import { GraphType, LoadType } from "../../Setup/Enums"
// import { Errors } from "../../Setup/Errors"

const WithClip = ClipMixin(InstanceBase)
const WithAudible = AudibleMixin(WithClip)
const WithAudibleFile = AudibleFileMixin(WithAudible)
const WithVisible = VisibleMixin(WithAudibleFile)
const WithTransformable = TransformableMixin(WithVisible)

class VideoClass extends WithTransformable implements Video {
  // constructor(...args : Any[]) {
  //   super(...args)
  //   const [object] = args
  //   const { speed } = <VideoObject> object
  //   if (speed && Is.aboveZero(speed)) this.speed = speed
  // }

  // private loadedAudio? : LoadedAudio

  get copy() : Video { return <Video> super.copy }

  declare definition : VideoDefinition

  definitionTime(quantize : number, time : Time) : Time {
    const scaledTime = super.definitionTime(quantize, time)
    if (this.speed === Default.instance.video.speed) return scaledTime

    return scaledTime.divide(this.speed) //, 'ceil')
  }

  override filterChainBase(args: FilterChainArgs): FilterChain {
    const filterChain = super.filterChainBase(args)

    const { graphFiles } = filterChain
    const source = this.definition.source
    if (source) {
      const options: ValueObject = { }
      if (args.graphType === GraphType.Cast) options.re = ''

      const graphFile: GraphFile = {
        type: LoadType.Video, file: source, options, input: true,
        definition: this.definition
      }
      graphFiles.push(graphFile)
    } else console.log(this.constructor.name, "filterChainBase no source!")
    // console.log(this.constructor.name, "filterChainBase", filterChain)
    return filterChain
  }

  speed = Default.instance.video.speed

  toJSON() : UnknownObject {
    const object = super.toJSON()
    if (this.speed !== Default.instance.video.speed) object.speed = this.speed
    return object
  }
}

export { VideoClass }
