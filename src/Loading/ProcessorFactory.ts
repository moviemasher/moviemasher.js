import { AudioProcessor } from "../Mash/Audio/AudioProcessor"
import { FontProcessor } from "../Mash/Font/FontProcessor"
import { Capitalize } from "../Utilities/Capitalize"
import { Processor } from "./Processor"

type ProcessorClassType = typeof Processor

const classes : {[index : string] : ProcessorClassType } = {
  Audio: AudioProcessor,
  Font: FontProcessor,
}

class ProcessorClass {
  audio() { return new classes.Audio() } //object : { audibleContext : AudibleContext}

  font() { return new classes.Font() }

  install(type : string, loader : ProcessorClassType) {
    classes[Capitalize(type)] = loader
  }
}

const ProcessorFactory = new ProcessorClass()
export { ProcessorFactory }
