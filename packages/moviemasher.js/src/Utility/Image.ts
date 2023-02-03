import { LoadedImage, LoadedVideo } from "../declarations";
import { Time } from "../Helpers/Time/Time";
import { timeFromSeconds } from "../Helpers/Time/TimeUtilities";
import { assertTrue } from "./Is";
import { Size, sizeAboveZero, sizeCopy, sizeCover } from "./Size";

const seekingPromises = new Map<LoadedVideo, Promise<LoadedImage>>()

const seek = (definitionTime: Time, video:HTMLVideoElement): void => {
  video.currentTime = definitionTime.seconds
}

const videoImagePromise = (video: LoadedVideo, outSize?: Size): Promise<LoadedImage> => {
  console.log('videoImagePromise', video.currentTime)
  
  const inSize = sizeCopy(video)
  const size = sizeAboveZero(outSize) ? sizeCover(inSize, outSize) : inSize
  const { width, height } = size
  const [canvas, context] = canvasContext(size)
  context.drawImage(video, 0, 0, width, height)
  const image = new Image()
  image.src = canvas.toDataURL()
  return image.decode().then(() => image)
}

const canvasContext = (size: Size): [HTMLCanvasElement, CanvasRenderingContext2D] => {
  const { document } = globalThis
  const canvas = document.createElement('canvas')
  const { width, height } = size
  canvas.height = height
  canvas.width = width
  const context = canvas.getContext('2d')
  assertTrue(context)
  return [canvas, context]
}


const seekNeeded = (definitionTime: Time, video:HTMLVideoElement): boolean => {
  const { currentTime } = video
  if (!(currentTime || definitionTime.frame)) return true

  const videoTime = timeFromSeconds(currentTime, definitionTime.fps)
  return !videoTime.equalsTime(definitionTime)
}

export const imageFromVideoPromise = (video: LoadedVideo, definitionTime: Time, outSize?: Size): Promise<LoadedImage> => {
  console.log('imageFromVideoPromise', definitionTime)
  
  const promise: Promise<LoadedImage> = new Promise(resolve => {
    if (!seekNeeded(definitionTime, video)) {
      console.log('imageFromVideoPromise !seekNeeded', definitionTime)

      seekingPromises.delete(video)
      return videoImagePromise(video, outSize)
    }
    console.log('imageFromVideoPromise seekNeeded', definitionTime)

    video.onseeked = () => {
      console.log('imageFromVideoPromise onseeked', definitionTime)

      video.onseeked = null
      videoImagePromise(video, outSize).then(image => {
        console.log('imageFromVideoPromise resolving after videoImagePromise', definitionTime)

        seekingPromises.delete(video)
        resolve(image)
      })
    }
    seek(definitionTime, video)
  })
  const existing = seekingPromises.get(video)
  
  seekingPromises.set(video, promise)
  if (existing) {
    console.log('imageFromVideoPromise replacing promise', definitionTime)
    
    return existing.then(() => promise)
  }
  console.log('imageFromVideoPromise setting promise', definitionTime)

  return promise
}
