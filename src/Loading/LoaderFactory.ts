import { Loader } from "."
import { AudioLoader } from "../Loading/AudioLoader"
import { FontLoader } from "../Loading/FontLoader"
import { ImageLoader } from "../Loading/ImageLoader"
import { ModuleLoader } from "../Loading/ModuleLoader"
import { UnknownObject } from "../Setup/declarations"
import { Capitalize } from "../Utilities"

type LoaderClassType = typeof Loader

const classes : {[index : string] : LoaderClassType } = {
  Audio: AudioLoader,
  Font: FontLoader,
  Image: ImageLoader,
  Module: ModuleLoader,
}

class LoaderClass {
  audio(object? : UnknownObject | undefined) : AudioLoader {
    return new (<typeof AudioLoader> classes.Audio)(object)
  }

  font() { return new classes.Font() }

  image() { return new classes.Image() }

  install(type : string, loader : LoaderClassType) {
    classes[Capitalize(type)] = loader
  }

  module() { return new classes.Module() }
}

const LoaderFactory = new LoaderClass()

export { LoaderFactory }
