import { AudioProcessor } from "../Loading/AudioProcessor"
import { FontProcessor } from "../Loading/FontProcessor"
import { ModuleProcessor } from "../Loading/ModuleProcessor"
import { AudibleContext } from "../Playing"
import { Capitalize } from "../Utilities/Capitalize"
import { Processor } from "./Processor"

type ProcessorClassType = typeof Processor

const classes : {[index : string] : ProcessorClassType } = {
  Audio: AudioProcessor,
  Font: FontProcessor,
  Module: ModuleProcessor,
}

class ProcessorClass {
  audio(object : { audibleContext : AudibleContext}) {
    return new (<typeof AudioProcessor> classes.Audio)(object)
  }

  font() { return new classes.Font() }

  install(type : string, loader : ProcessorClassType) {
    classes[Capitalize(type)] = loader
  }

  module() { return new classes.Module() }
}

const ProcessorFactory = new ProcessorClass()
export { ProcessorFactory }
