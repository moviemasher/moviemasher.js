import {
  TextStyle, ValueObject, GraphFile, GraphFiles, ModularGraphFilter
} from "../../../declarations"
import { AVType, DataType, GraphFileType, GraphType, LoadType } from "../../../Setup/Enums"
import { Is } from "../../../Utility/Is"
import { Parameter } from "../../../Setup/Parameter"
import { Errors } from "../../../Setup/Errors"
import { FilterDefinitionClass } from "../FilterDefinitionClass"
import { VisibleContext } from "../../../Context"
import { fontDefinitionFromId } from "../../Font/FontFactory"
import { Evaluator } from "../../../Helpers/Evaluator"
import { colorBlack, colorServer } from "../../../Utility/Color"

/**
 * @category Filter
 */
export class DrawTextFilter extends FilterDefinitionClass {
  protected override drawFilterDefinition(evaluator : Evaluator) : VisibleContext {
    const { visibleContext: context, preloader, graphType } = evaluator
    if (!context) throw Errors.invalid.context + this.id

    const fontface = evaluator.parameter('fontface')
    const x = evaluator.parameter('x')
    const y = evaluator.parameter('y')
    const fontsize = evaluator.parameter('fontsize')
    const fontcolor = evaluator.parameter('fontcolor')
    const shadowcolor = evaluator.parameter('shadowcolor')
    const shadowx = evaluator.parameter('shadowx')
    const shadowy = evaluator.parameter('shadowy')

    if (!(fontsize && Is.aboveZero(fontsize))) throw Errors.eval.number + " fontsize"

    const definition = fontDefinitionFromId(String(fontface))
    const file = definition.preloadableSource(graphType)
    const graphFile: GraphFile = {
      type: LoadType.Font, file, definition
    }
    const fontFace = preloader.getFile(graphFile)
    const height = Number(fontsize)
    const { family } = fontFace
    const textStyle : TextStyle =  {
      height,
      family,
      color: String(fontcolor),
      shadow: String(shadowcolor),
      shadowPoint: { x: Number(shadowx), y: Number(shadowy) },
    }
    const point = { x: Number(x), y: Number(y) }
    context.drawTextAtPoint(String(evaluator.propertyValue('string')), textStyle, point)
    return context
  }

  modularGraphFilter(evaluator: Evaluator): ModularGraphFilter {
    const { avType, graphType, preloading } = evaluator
    const graphFiles: GraphFiles = []
    const options: ValueObject = {}
    const justAudio = avType === AVType.Audio
    if (!justAudio) {
      const fontface = evaluator.parameter('fontface')
      const x = evaluator.parameter('x')
      const y = evaluator.parameter('y')
      const fontsize = evaluator.parameter('fontsize')
      const fontcolor = evaluator.parameter('fontcolor')
      const shadowcolor = evaluator.parameter('shadowcolor')
      const shadowx = evaluator.parameter('shadowx')
      const shadowy = evaluator.parameter('shadowy')
      const canvasGraph = graphType === GraphType.Canvas

      if (fontcolor) options.fontcolor = canvasGraph ? fontcolor : colorServer(String(fontcolor))
      if (fontsize) options.fontsize = fontsize
      if (x || y) {
        options.x = x || 0
        options.y = y || 0
      }
      if (shadowcolor && (shadowx || shadowy)) {
        options.shadowcolor = shadowcolor
        options.shadowx = shadowx || 0
        options.shadowy = shadowy || 0
      }
      const definition = fontDefinitionFromId(String(fontface))

      const file = definition.preloadableSource(graphType)

      const graphFile: GraphFile = { type: LoadType.Font, file, definition }
      graphFiles.push(graphFile)

      const { preloader } = evaluator
      const textGraphFile: GraphFile = {
        definition: this,
        type: GraphFileType.Txt, file: String(evaluator.propertyValue('string'))
      }
      graphFiles.push(textGraphFile)
      options.textfile = preloader.key(textGraphFile)
      options.fontfile = preloader.key(graphFile)

      if (!preloading && canvasGraph) {
        evaluator.visibleContext = this.drawFilterDefinition(evaluator)
      }
    }
    const graphFilter: ModularGraphFilter = {
      inputs: [],
      filter: this.ffmpegFilter,
      options, graphFiles
    }
    return graphFilter
  }

  parameters = [
    new Parameter({ name: "fontcolor", value: colorBlack, dataType: DataType.Rgba }),
    new Parameter({ name: "shadowcolor", value: "#FFFFFF", dataType: DataType.Rgba }),
    new Parameter({ name: "fontsize", value: "out_height * 0.2", dataType: DataType.Number }),
    new Parameter({ name: "x", value: "0", dataType: DataType.Number }),
    new Parameter({ name: "y", value: "0", dataType: DataType.Number }),
    new Parameter({ name: "shadowx", value: "out_width * 0.015", dataType: DataType.Number }),
    new Parameter({ name: "shadowy", value: "out_width * 0.015", dataType: DataType.Number }),
    new Parameter({ name: "fontface", value: "com.moviemasher.font.default", dataType: DataType.String }),
  ]
}
