import { Factory } from "./Factory"
import { LoadType } from "../Types"
import { AudioLoader, FontLoader, ImageLoader, ModuleLoader } from "../Loader"

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

