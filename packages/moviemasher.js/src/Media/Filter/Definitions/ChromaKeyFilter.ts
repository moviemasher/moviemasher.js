import { Pixels, Yuv } from "../../../declarations"
import { Errors } from "../../../Setup/Errors"
import { Parameter } from "../../../Setup/Parameter"
import { Evaluator } from "../../../Helpers/Evaluator"
import { colorGreen, colorRgbToYuv, colorToRgb, colorYuvBlend } from "../../../Utility/Color"
import { pixelNeighboringRgbas, pixelRgbaAtIndex } from "../../../Utility/Pixel"
import { FilterDefinitionClass } from "../FilterDefinition"
import { VisibleContext } from "../../../Context/VisibleContext"
import { DataType } from "../../../Setup/Enums"

/**
 * @category Filter
 */
class ChromaKeyFilter extends FilterDefinitionClass {
  protected override drawFilterDefinition(evaluator : Evaluator) : VisibleContext {
    const { visibleContext: context } = evaluator
    if (!context) throw Errors.invalid.context + this.id

    const accurate = evaluator.propertyValue('accurate')
    const similarity = evaluator.parameterNumber('similarity')
    const color = String(evaluator.parameter('color'))
    const blend = evaluator.parameterNumber('blend')
    const { width, height } = context.size

    const rgb = colorToRgb(color)
    const yuv = colorRgbToYuv(rgb)
    const frame = context.imageData
    const pixelsRgb = frame.data

    let pixels = pixelsRgb.length / 4
    while(pixels--) {
      const pixels_offset = pixels * 4

        const matrix = [colorRgbToYuv(pixelRgbaAtIndex(pixels_offset, pixelsRgb))]
        // more accurate, but so slow...
        // matrix = MovieMasher.Filter.rgb_matrix(pixels_offset, data, width, height)
        // for (i = 0; i < matrix.length; i++) matrix[i] = MovieMasher.Colors.rgb2yuv(matrix[i])
        pixelsRgb[pixels_offset + 3]  = colorYuvBlend(matrix, yuv, similarity, blend)
    }


    // const pixelsYuv = accurate ? (
    //   this.yuvsFromPixelsAccurate(pixelsRgb, width, height) // slow!
    // ) : this.yuvsFromPixels(pixelsRgb)

    // let offset = 0

    // pixelsYuv.reverse().forEach(matrix => {
    //   pixelsRgb[offset + 3] = colorYuvBlend(matrix, yuv, similarity, blend)
    //   offset += 4
    // })
    context.drawImageData(frame)
    return context
  }

  parameters = [
    new Parameter({ name: "color", value: colorGreen, dataType: DataType.Rgb }),
    new Parameter({ name: "similarity", value: 0.5, dataType: DataType.Number }),
    new Parameter({ name: "blend", value: 0.01, dataType: DataType.Number }),
  ]

  private yuvsFromPixels(pixels : Pixels) : Yuv[][] {
    const array: Yuv[][] = []
    for (let index = pixels.length / 4 - 1; index > 0; index -= 1) {
      array.push([colorRgbToYuv(pixelRgbaAtIndex(index * 4, pixels))])
    }
    return array
  }

  private yuvsFromPixelsAccurate(pixels: Pixels, width: number, height: number): Yuv[][] {
    console.log(this.constructor.name, "yuvsFromPixelsAccurate")
    const array:Yuv[][] = []
    for (let index = pixels.length / 4 - 1; index > 0; index -= 1) {
      const size = { width, height }
      array.push(pixelNeighboringRgbas(index * 4, pixels, size).map(rgb => colorRgbToYuv(rgb)))
    }
    return array
  }
}

export { ChromaKeyFilter }
