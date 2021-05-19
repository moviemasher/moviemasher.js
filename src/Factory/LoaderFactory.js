import { Factory } from "./Factory"
import { LoadType } from "../Setup/Types"

import { AudioLoader } from "../Loading/AudioLoader"
import { FontLoader } from "../Loading/FontLoader"
import { ImageLoader } from "../Loading/ImageLoader"
import { ModuleLoader } from "../Loading/ModuleLoader"


class LoaderFactory extends Factory {
  constructor() {
    super()
    this.install(LoadType.audio, AudioLoader)
    this.install(LoadType.font, FontLoader)
    this.install(LoadType.image, ImageLoader)
    this.install(LoadType.module, ModuleLoader)
  }
}

const LoaderFactoryInstance = new LoaderFactory
export { LoaderFactoryInstance as LoaderFactory }
