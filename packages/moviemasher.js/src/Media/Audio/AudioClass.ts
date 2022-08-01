import { LoadType, TrackType } from "../../Setup/Enums"
import { AudioDefinition, Audio } from "./Audio"
import { InstanceBase } from "../../Instance/InstanceBase"
import { PreloadableMixin } from "../../Mixin/Preloadable/PreloadableMixin"
import { UpdatableDurationMixin } from "../../Mixin/UpdatableDuration/UpdatableDurationMixin"
import { ContentMixin } from "../../Content/ContentMixin"
import { TweenableMixin } from "../../Mixin/Tweenable/TweenableMixin"
import { ValueObject } from "../../declarations"
import { GraphFile, GraphFileArgs, GraphFiles } from "../../MoveMe"


const AudioWithTweenable = TweenableMixin(InstanceBase)
const AudioWithContent = ContentMixin(AudioWithTweenable)
const AudioWithPreloadable = PreloadableMixin(AudioWithContent)
const AudioWithUpdatableDuration = UpdatableDurationMixin(AudioWithPreloadable)
export class AudioClass extends AudioWithUpdatableDuration implements Audio {
  declare definition : AudioDefinition

  graphFiles(args: GraphFileArgs): GraphFiles {
    const { editing, audible, time, clipTime } = args
    if (!audible) return []

    if (editing && !time.isRange) return []

    const { definition } = this
    // const itsoffset = clipTime!.seconds - time.seconds
    const options: ValueObject = {  }
    // if (itsoffset) options.itsoffset = itsoffset
    const graphFile: GraphFile = {
      type: LoadType.Audio, file: definition.urlAudible, definition, input: true,
      options
    }
    return [graphFile]
  }

  mutable() { return true }
  
  trackType = TrackType.Audio
}
