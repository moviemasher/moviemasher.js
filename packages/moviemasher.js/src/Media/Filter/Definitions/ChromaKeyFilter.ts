import { Pixels, ValueObject, Yuv } from "../../../declarations"
import { Errors } from "../../../Setup/Errors"
import { Parameter } from "../../../Setup/Parameter"
import { Evaluator } from "../../../Helpers/Evaluator"
import { colorRgbToYuv, colorToRgb, colorYuvBlend } from "../../../Utility/Color"
import { pixelNeighboringRgbas, pixelRgbaAtIndex } from "../../../Utility/Pixel"
import { FilterDefinitionClass } from "../FilterDefinition"
import { VisibleContext } from "../../../Context/VisibleContext"
import { DataType } from "../../../Setup/Enums"

/**
 * @category Filter
 */
class ChromaKeyFilter extends FilterDefinitionClass {
  draw(evaluator : Evaluator, evaluated : ValueObject) : VisibleContext {
    const { context } = evaluator
    if (!context) throw Errors.invalid.context

    const { width, height } = context.size
    const { accurate } = evaluated
    const similarity = Number(evaluated.similarity)
    const blend = Number(evaluated.blend)

    const color = String(evaluated.color)
    const rgb = colorToRgb(color)
    const yuv = colorRgbToYuv(rgb)
    const frame = context.imageData
    const pixelsRgb = frame.data
    const pixelsYuv = accurate ? (
      this.yuvsFromPixelsAccurate(pixelsRgb, width, height) // slow!
    ) : this.yuvsFromPixels(pixelsRgb)

    let offset = 0

    pixelsYuv.reverse().forEach(matrix => {
      pixelsRgb[offset + 3] = colorYuvBlend(matrix, yuv, similarity, blend)
      offset += 4
    })
    context.drawImageData(frame)
    return context
  }

  parameters = [
    new Parameter({ name: "color", value: "color", dataType: DataType.Rgb }),
    new Parameter({ name: "similarity", value: "similarity" }),
    new Parameter({ name: "blend", value: "blend" }),
  ]

  yuvsFromPixels(pixels : Pixels) : Yuv[][] {
    const array: Yuv[][] = []
    for (let index = pixels.length / 4 - 1; index > 0; index -= 1) {
      array.push([colorRgbToYuv(pixelRgbaAtIndex(index * 4, pixels))])
    }
    return array
  }

  yuvsFromPixelsAccurate(pixels : Pixels, width : number, height : number) : Yuv[][] {
    const array:Yuv[][] = []
    for (let index = pixels.length / 4 - 1; index > 0; index -= 1) {
      const size = { width, height }
      array.push(pixelNeighboringRgbas(index * 4, pixels, size).map(rgb => colorRgbToYuv(rgb)))
    }
    return array
  }
}

export { ChromaKeyFilter }
