import { Factory } from "./Factory"
import { LoadType } from "../Setup/Types"
import { AudioProcessor } from "../Loading/AudioProcessor"
import { FontProcessor } from "../Loading/FontProcessor"
import { ImageProcessor } from "../Loading/ImageProcessor"
import { ModuleProcessor } from "../Loading/ModuleProcessor"

class ProcessorFactory extends Factory {
  constructor() {
    super()
    this.install(LoadType.audio, AudioProcessor)
    this.install(LoadType.font, FontProcessor)
    this.install(LoadType.image, ImageProcessor)
    this.install(LoadType.module, ModuleProcessor)
  }
}

const ProcessorFactoryInstance = new ProcessorFactory
export { ProcessorFactoryInstance as ProcessorFactory }
