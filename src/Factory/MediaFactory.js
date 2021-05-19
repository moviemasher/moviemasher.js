import { Factory } from "./Factory"
import { MediaType, Module, ModuleTypes } from "../Setup"
import { EffectMedia } from "../Media/EffectMedia"
import { ScalerMedia } from "../Media/ScalerMedia"
import { MergerMedia } from "../Media/MergerMedia"
import { AudioMedia } from "../Media/AudioMedia"
import { FontMedia } from "../Media/FontMedia"
import { VideoMedia } from "../Media/VideoMedia"
import { ImageMedia } from "../Media/ImageMedia"
import { ThemeMedia } from "../Media/ThemeMedia"
import { TransitionMedia } from "../Media/TransitionMedia"
import { Is } from "../Utilities"
import { Media } from "../Media/Media"

class MediaFactory extends Factory {
  constructor() {
    super(Media)
    this.install(MediaType.audio, AudioMedia)
    this.install(MediaType.video, VideoMedia)
    this.install(MediaType.image, ImageMedia)
    this.install(MediaType.theme, ThemeMedia)
    this.install(MediaType.effect, EffectMedia)
    this.install(MediaType.scaler, ScalerMedia)
    this.install(MediaType.merger, MergerMedia)
    this.install(MediaType.font, FontMedia)
    this.install(MediaType.transition, TransitionMedia)
  }

  create(object) {
    if (Is.instanceOf(object, Media)) return object

    if (ModuleTypes.includes(object.type)) {
      const module = Module.ofType(object.id, object.type)
      if (module) return super.create(module)
    }
    return super.create(object)
  }
}
const MediaFactoryInstance = new MediaFactory()
export { MediaFactoryInstance as MediaFactory }
