import { Processor } from "./Processor"

class ImageProcessor extends Processor {
  process(url, buffer) {
    console.log("ImageProcessor.process", url)
  }
}

export { ImageProcessor }
