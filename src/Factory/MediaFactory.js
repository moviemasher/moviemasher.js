

import { Factory } from "./Factory"
import { MediaType } from "../Types"
import { EffectMedia } from "../Media/EffectMedia"
import { ScalerMedia } from "../Media/ScalerMedia"
import { MergerMedia } from "../Media/MergerMedia"
import { AudioMedia } from "../Media/AudioMedia"
import { FontMedia } from "../Media/FontMedia"
import { VideoMedia } from "../Media/VideoMedia"
import { ImageMedia } from "../Media/ImageMedia"
import { ThemeMedia } from "../Media/ThemeMedia"
import { TransitionMedia } from "../Media/TransitionMedia"

class MediaFactory extends Factory {
  constructor() {
    super()
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
}
const MediaFactoryInstance = new MediaFactory
export { MediaFactoryInstance as MediaFactory }