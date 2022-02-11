import { AudioLoader } from "../Media/Audio/AudioLoader"
import { FontLoader } from "../Media/Font/FontLoader"
import { ImageLoader } from "../Media/Image/ImageLoader"
import { VideoLoader } from "../Media/Video/VideoLoader"
import { PreloaderClass } from "../Preloader/PreloaderClass"


const LoaderFactoryClasses = {
  audio: AudioLoader, font: FontLoader, image: ImageLoader, video: VideoLoader,
}

const createLoaderAudio = (preloader: PreloaderClass): AudioLoader => { return new LoaderFactoryClasses.audio(preloader) }

const createLoaderImage = (preloader: PreloaderClass): ImageLoader => { return new LoaderFactoryClasses.image(preloader) }

const createLoaderFont = (preloader: PreloaderClass): FontLoader => { return new LoaderFactoryClasses.font(preloader) }

const createLoaderVideo = (preloader: PreloaderClass): VideoLoader => { return new LoaderFactoryClasses.video(preloader) }

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
