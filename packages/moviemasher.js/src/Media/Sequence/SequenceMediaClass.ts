import { Numbers, UnknownRecord} from "../../Types/Core"
import { Time } from "../../Helpers/Time/Time"
import { SequenceClass } from "./SequenceClass"
import {
  Sequence, SequenceMedia, SequenceMediaObject,
  SequenceObject
} from "./Sequence"
import { Default } from "../../Setup/Default"
import { ContentDefinitionMixin } from "../Content/ContentDefinitionMixin"
import { UpdatableSizeDefinitionMixin } from "../../Mixin/UpdatableSize/UpdatableSizeDefinitionMixin"
import { UpdatableDurationDefinitionMixin } from "../../Mixin/UpdatableDuration/UpdatableDurationDefinitionMixin"
import { TweenableDefinitionMixin } from "../../Mixin/Tweenable/TweenableDefinitionMixin"
import { isPositive } from "../../Utility/Is"
import { MediaBase } from "../MediaBase"
import { SequenceType } from "../../Setup/Enums"

const SequenceMediaWithTweenable = TweenableDefinitionMixin(MediaBase)
const SequenceMediaWithContent = ContentDefinitionMixin(SequenceMediaWithTweenable)
const SequenceMediaWithUpdatableSize = UpdatableSizeDefinitionMixin(SequenceMediaWithContent)
const SequenceMediaWithUpdatableDuration = UpdatableDurationDefinitionMixin(SequenceMediaWithUpdatableSize)
export class SequenceMediaClass extends SequenceMediaWithUpdatableDuration implements SequenceMedia {
  constructor(...args : any[]) {
    const [object] = args
    super(object)
    const {
      padding, begin, fps, increment, pattern
    } = <SequenceMediaObject>object

    if (isPositive(begin)) this.begin = begin
    if (fps) this.fps = fps
    if (increment) this.increment = increment
    if (pattern) this.pattern = pattern
    if (padding) this.padding = padding
    else {
      const lastFrame = this.begin + (this.increment * this.framesMax - this.begin)
      this.padding = String(lastFrame).length
    }
    // TODO: support speed
    // this.properties.push(propertyInstance({ name: "speed", type: DataType.Number, value: 1.0 }))
  }

  begin = Default.definition.videosequence.begin

  fps = Default.definition.videosequence.fps

  framesArray(start: Time): Numbers {
    const { duration, fps } = this
    return start.durationFrames(duration, fps)
  }

  private get framesMax() : number { 
    const { fps, duration } = this
    // console.log(this.constructor.name, "framesMax", fps, duration)
    return Math.floor(fps * duration) - 2 
  }

  increment = Default.definition.videosequence.increment

  instanceFromObject(object: SequenceObject = {}): Sequence {
    return new SequenceClass(this.instanceArgs(object))
  }

  // loadType = ImageType

  padding : number

  pattern = '%.jpg'

  toJSON() : UnknownRecord {
    const json = super.toJSON()
    const { videosequence } = Default.definition
    const { pattern, increment, begin, fps, padding } = this
    if (pattern !== videosequence.pattern) json.pattern = pattern
    if (increment !== videosequence.increment) json.increment = increment
    if (begin !== videosequence.begin) json.begin = begin
    if (fps !== videosequence.fps) json.fps = fps
    if (padding !== videosequence.padding) json.padding = padding
    return json
  }

  type = SequenceType

  // urlForFrame(frame : number): string {
  //   const { increment, begin, padding, url, pattern } = this
  //   // console.log(this.constructor.name, "urlForFrame", frame, increment, begin, padding, url, pattern )
  //   let s = String((frame * increment) + begin)
  //   if (padding) s = s.padStart(padding, '0')
    
  //   return (url + pattern).replaceAll('%', s)
  // }
}
