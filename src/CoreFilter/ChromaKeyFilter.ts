import { CoreFilter } from "./CoreFilter"
import { Colors } from "../Utilities"
import { Pixel } from "../Utilities"

class ChromaKeyFilter extends CoreFilter {
  get parameters() { 
    return [
      { name: "color", value: "color" },
      { name: "similarity", value: "similarity" },
      { name: "blend", value: "blend" }
    ]
  }

  draw(evaluator, evaluated) {
    const context = evaluator.context
    const canvas = context.canvas
    const { width, height } = canvas
    const { blend, color, similarity, accurate } = evaluated
    const components = color.substr(4, color.length - 5).split(',')
    const colors = components.map(f => Number(f))
    const rgb = { r: colors[0], g: colors[1], b: colors[2] }
    const yuv = Colors.rgb2yuv(rgb)
    const frame = context.getImageData(0, 0, width, height)
    const pixels = frame.data
    const yuvs = accurate ? (
      this.yuvsFromPixelsAccurate(pixels, width, height)
    ) : this.yuvsFromPixels(pixels)
    
    let offset = 0
    yuvs.forEach(matrix => {
      pixels[offset + 3] = Colors.yuv_blend(matrix, yuv, similarity, blend)
      offset += 4
    })
    context.putImageData(frame, 0, 0)
    return context
  }

  yuvsFromPixelsAccurate(pixels, width, height) {
    let index = pixels.length / 4
    const array = []
    while(index--) {
      const offset = index * 4
      const rgbs = Pixel.rgbs(offset, pixels, width, height)
      array.push(rgbs.map(rgb => Colors.rgb2yuv(rgb)))
    }
    return array
  }

  yuvsFromPixels(pixels) {
    let index = pixels.length / 4
    const array = []
    while(index--) {
      const offset = index * 4
      array.push([Colors.rgb2yuv(Pixel.rgbAtIndex(offset, pixels))])
    }
    return array
  }
}
const ChromaKeyFilterInstance = new ChromaKeyFilter
export { ChromaKeyFilterInstance as ChromaKeyFilter } 