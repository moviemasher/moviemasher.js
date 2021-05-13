
import { Factory } from "./Factory"
import { Errors } from "../Errors"
import { Is } from '../Is'
import { 
  AudioClip, 
  VideoClip, 
  ImageClip, 
  ThemeClip, 
  TransitionClip, 
  FrameClip 
} from "../Clip"
import { ClipType } from "../Types"
import { TimeFactory } from '../Factory/TimeFactory'

class ClipFactory extends Factory {
  constructor() {
    super()
    this.classesByType[ClipType.audio] = AudioClip
    this.classesByType[ClipType.frame] = FrameClip
    this.classesByType[ClipType.image] = ImageClip
    this.classesByType[ClipType.theme] = ThemeClip
    this.classesByType[ClipType.transition] = TransitionClip
    this.classesByType[ClipType.video] = VideoClip
  }
  create(object = {}, media = {}, mash = {}) {
    if (!Is.object(object)) throw(Errors.object)
    if (!Is.object(media)) throw(Errors.media)
  
    if (!Is.integer(object.frames)) {
      object.frames = TimeFactory.createFromSeconds(media.duration, mash.quantize, 'floor').frame
    }
    object.media ||= media
    const media_type = object.type || media.type
    const klass = this.typeClass(media_type)
    const instance = new klass(object)
    return instance
  }

  createFromMedia(media, mash) {
    const object = { id: media.id, type: media.type }
    return this.create(object, media, mash)
  }
}

const ClipFactoryInstance = new ClipFactory
export { ClipFactoryInstance as ClipFactory }

