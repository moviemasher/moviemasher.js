import { FilesArgs, GraphFiles, UnknownObject } from "../../declarations"
import { Default } from "../../Setup/Default"
import { AVType, GraphType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { Time } from "../../Helpers/Time/Time"
import { VideoSequence, VideoSequenceDefinition } from "./VideoSequence"
import { InstanceBase } from "../../Base/Instance"
import { ClipMixin } from "../../Mixin/Clip/ClipMixin"
import { TransformableMixin } from "../../Mixin/Transformable/TransformableMixin"
import { AudibleMixin } from "../../Mixin/Audible/AudibleMixin"
import { AudibleFileMixin } from "../../Mixin/AudibleFile/AudibleFileMixin"
import { VisibleMixin } from "../../Mixin/Visible/VisibleMixin"
import { FilterChain } from "../../Edited/Mash/FilterChain/FilterChain"

const WithClip = ClipMixin(InstanceBase)
const WithAudible = AudibleMixin(WithClip)
const WithAudibleFile = AudibleFileMixin(WithAudible)
const WithVisible = VisibleMixin(WithAudibleFile)
const WithTransformable = TransformableMixin(WithVisible)

export class VideoSequenceClass extends WithTransformable implements VideoSequence {
  override filterChainInitialize(filterChain: FilterChain): void  {
    const { filterGraph } = filterChain
    const {
      graphType, avType, preloading, time, quantize, preloader
    } = filterGraph
    // if (avType === AVType.Audio) throw Errors.internal + 'initializeFilterChain avType'

    const args: FilesArgs = { avType, graphType, quantize, time }
    this.clipFiles(args).forEach(file => { filterChain.addGraphFile(file) })

    const definitionTime = this.definitionTime(quantize, time)
    if (!preloading && graphType === GraphType.Canvas && avType !== AVType.Audio) {
      const context = this.contextAtTimeToSize(preloader, definitionTime, quantize)
      if (!context) throw Errors.invalid.context + ' ' + this.constructor.name + '.initializeFilterChain'

      filterChain.visibleContext = context
    }
  }

  get copy() : VideoSequence { return super.copy as VideoSequence }

  private clipFiles(args: FilesArgs): GraphFiles {
    const { quantize, time } = args
    const definitionTime = this.definitionTime(quantize, time)

    const definitionArgs: FilesArgs = { ...args, time: definitionTime }
    return this.definition.definitionFiles(definitionArgs)
  }
  declare definition : VideoSequenceDefinition

  definitionTime(quantize : number, time : Time) : Time {
    const scaledTime = super.definitionTime(quantize, time)
    if (this.speed === Default.instance.video.speed) return scaledTime

    return scaledTime.divide(this.speed) //, 'ceil')
  }

  speed = Default.instance.video.speed

  toJSON() : UnknownObject {
    const object = super.toJSON()
    if (this.speed !== Default.instance.video.speed) object.speed = this.speed
    return object
  }
}
