import { Loader } from "./Loader"
import { AudioLoader } from "../Mash/Audio/AudioLoader"
import { FontLoader } from "../Mash/Font/FontLoader"
import { ImageLoader } from "../Mash/Image/ImageLoader"
import { VideoLoader } from "../Mash/Video/VideoLoader"
import { Capitalize } from "../Utilities/Capitalize"

type LoaderClassType = typeof Loader

const classes : {[index : string] : LoaderClassType } = {
  Audio: AudioLoader,
  Font: FontLoader,
  Image: ImageLoader,
  Video: VideoLoader,
}

class LoaderClass {
  audio() { return new classes.Audio() }

  font() { return new classes.Font() }

  image() { return new classes.Image() }

  install(type : string, loader : LoaderClassType) {
    classes[Capitalize(type)] = loader
  }

  video() { return new classes.Video()}
}

const LoaderFactory = new LoaderClass()

export { LoaderFactory }
