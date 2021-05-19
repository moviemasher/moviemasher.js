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

  createFromObjectMedia(object = {}, media = {}, mash = {}) {
    if (!Is.object(object)) throw Errors.object
    if (!Is.object(media)) throw Errors.media

    if (!Is.integer(object.frames)) {
      object.frames = TimeFactory.createFromSeconds(media.duration, mash.quantize, 'floor').frame
    }
    object.media ||= media
    const type = object.type || media.type
    media.type ||= type
    object.type ||= type
    if (!ClipTypes.includes(type)) throw Errors.unknown.type

    return this.createFromObject(object)
  }

  createFromMedia(media, mash) {
    const object = { id: media.id, type: media.type }
    return this.createFromObjectMedia(object, media, mash)
  }
}

const ClipFactoryInstance = new ClipFactory()
export { ClipFactoryInstance as ClipFactory }
