import {
  TextStyle, ValueObject, GraphFile, GraphFiles, ModularGraphFilter
} from "../../../declarations"
import { AVType, DataType, GraphFileType, GraphType, LoadType } from "../../../Setup/Enums"
import { Is } from "../../../Utility/Is"
import { Parameter } from "../../../Setup/Parameter"
import { Errors } from "../../../Setup/Errors"
import { FilterDefinitionClass } from "../FilterDefinition"
import { VisibleContext } from "../../../Context"
import { fontDefinitionFromId } from "../../Font/FontFactory"
import { Evaluator } from "../../../Helpers/Evaluator"
import { colorBlack } from "../../../Utility/Color"

/**
 * @category Filter
 */
class DrawTextFilter extends FilterDefinitionClass {
  draw(evaluator : Evaluator) : VisibleContext {
    const { context, preloader } = evaluator
    if (!context) throw Errors.invalid.context

    const fontface = evaluator.evaluateParameter('fontface')
    const x = evaluator.evaluateParameter('x')
    const y = evaluator.evaluateParameter('y')
    const fontsize = evaluator.evaluateParameter('fontsize')
    const fontcolor = evaluator.evaluateParameter('fontcolor')
    const shadowcolor = evaluator.evaluateParameter('shadowcolor')
    const shadowx = evaluator.evaluateParameter('shadowx')
    const shadowy = evaluator.evaluateParameter('shadowy')

    if (!(fontsize && Is.aboveZero(fontsize))) throw Errors.eval.number + " fontsize"

    const definition = fontDefinitionFromId(String(fontface))
    const {source} = definition
    const graphFile: GraphFile = { type: LoadType.Font, file: source }
    const fontFace = preloader.getFile(graphFile)
    const height = Number(fontsize)
    const { family } = fontFace
    const textStyle : TextStyle =  {
      height,
      family,
      color: String(fontcolor || colorBlack),
      shadow: String(shadowcolor || ""),
      shadowPoint: { x: Number(shadowx || 0), y: Number(shadowy || 0) },
    }
    const point = { x: Number(x || 0), y: Number(y || 0) }
    context.drawTextAtPoint(String(evaluator.modularValue('string')), textStyle, point)
    return context
  }

  modularGraphFilter(evaluator: Evaluator): ModularGraphFilter {
    const { avType, graphType } = evaluator
    const graphFiles: GraphFiles = []
    const options: ValueObject = {}
    const justAudio = avType && avType === AVType.Audio
    if (!justAudio) {
      const fontface = evaluator.evaluateParameter('fontface')
      const x = evaluator.evaluateParameter('x')
      const y = evaluator.evaluateParameter('y')
      const fontsize = evaluator.evaluateParameter('fontsize')
      const fontcolor = evaluator.evaluateParameter('fontcolor')
      const shadowcolor = evaluator.evaluateParameter('shadowcolor')
      const shadowx = evaluator.evaluateParameter('shadowx')
      const shadowy = evaluator.evaluateParameter('shadowy')
      const canvasGraph = graphType === GraphType.Canvas

      if (fontcolor) options.fontcolor = fontcolor
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
      const graphFile: GraphFile = {
        type: LoadType.Font, file: definition.source, definition
      }
      graphFiles.push(graphFile)
      if (!canvasGraph) {
        const { preloader } = evaluator
        const textGraphFile: GraphFile = {
          type: GraphFileType.Txt, file: String(evaluator.modularValue('string'))
        }
        graphFiles.push(textGraphFile)
        options.textfile = preloader.key(textGraphFile)
        options.fontfile = preloader.key(graphFile)
      }
    }
    const graphFilter: ModularGraphFilter = {
      inputs: [],
      outputs: ['TEXT'],
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

export { DrawTextFilter }
