import { Factory } from "./Factory"
import { LoadType } from "../Types"
import { AudioProcessor, FontProcessor, ImageProcessor, ModuleProcessor } from "../Processor"

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

