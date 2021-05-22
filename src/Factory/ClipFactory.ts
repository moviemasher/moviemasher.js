import { Factory } from "./Factory"
import { Errors, ClipType } from "../Setup"
import { Is } from "../Utilities"
import {
  AudioClip,
  VideoClip,
  ImageClip,
  ThemeClip,
  TransitionClip,
  FrameClip,
  Clip
} from "../Clip"
import { TimeFactory } from "./TimeFactory"
import { ClipTypes } from "../Setup/Types"

class ClipFactory extends Factory {
  constructor() {
    super(Clip)
    this.install(ClipType.audio, AudioClip)
    this.install(ClipType.frame, FrameClip)
    this.install(ClipType.image, ImageClip)
    this.install(ClipType.theme, ThemeClip)
    this.install(ClipType.transition, TransitionClip)
    this.install(ClipType.video, VideoClip)
  }

  createFromObjectMedia(object = {}, media = {}, mash = {}) : Clip {
    if (!Is.object(object)) throw Errors.object
    if (!Is.object(media)) throw Errors.media

    const clipObject = { ...object }
    if (!Is.integer(clipObject.frames)) {
      const { duration } = media
      const { quantize } = mash
      const time = TimeFactory.createFromSeconds(duration, quantize, 'floor')
      clipObject.frames = time.frame
    }
    clipObject.media ||= media
    const type = clipObject.type || media.type
    media.type ||= type
    clipObject.type ||= type
    if (!ClipTypes.includes(type)) throw Errors.unknown.type

    return this.createFromObject(clipObject)
  }

  createFromMedia(media, mash) : Clip {
    const object = { id: media.id, type: media.type }
    return this.createFromObjectMedia(object, media, mash)
  }
}

const ClipFactoryInstance = new ClipFactory()
export { ClipFactoryInstance as ClipFactory }
