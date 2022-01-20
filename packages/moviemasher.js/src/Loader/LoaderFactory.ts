import { AudioLoader } from "../Media/Audio/AudioLoader"
import { FontLoader } from "../Media/Font/FontLoader"
import { ImageLoader } from "../Media/Image/ImageLoader"
import { VideoLoader } from "../Media/Video/VideoLoader"

const LoaderFactoryClasses = {
  audio: AudioLoader, font: FontLoader, image: ImageLoader, video: VideoLoader,
}

const createLoaderAudio = (): AudioLoader => { return new LoaderFactoryClasses.audio() }

const createLoaderImage = (): ImageLoader => { return new LoaderFactoryClasses.image() }


const createLoaderFont = (): FontLoader => { return new LoaderFactoryClasses.font() }

const createLoaderVideo = (): VideoLoader => { return new LoaderFactoryClasses.video() }

/**
 * All methods return an instance that subclasses {@link Loader} to load raw media assets.
 * @category Factory
 */
const LoaderFactory = {
  audio: createLoaderAudio,

  font: createLoaderFont,
  image: createLoaderImage,
  video: createLoaderVideo,
}

export { LoaderFactory, LoaderFactoryClasses }
