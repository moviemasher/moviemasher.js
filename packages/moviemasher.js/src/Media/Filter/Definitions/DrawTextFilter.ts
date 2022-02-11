import { GraphFilter, Value, TextStyle, ValueObject, FilterChainArgs } from "../../../declarations"
import { Is } from "../../../Utility/Is"
import { Parameter } from "../../../Setup/Parameter"
import { Errors } from "../../../Setup/Errors"
import { FilterDefinitionClass } from "../FilterDefinition"
import { VisibleContext } from "../../../Context"
import { fontDefinitionFromId } from "../../Font/FontFactory"
import { Evaluator } from "../../../Helpers/Evaluator"
import { DataType, LoadType } from "../../../Setup/Enums"


/**
 * @category Filter
 */
class DrawTextFilter extends FilterDefinitionClass {
  draw(evaluator : Evaluator, evaluated : ValueObject) : VisibleContext {
    const { context } = evaluator
    if (!context) throw Errors.invalid.context

    // const fontface = String(evaluator.evaluate("fontface"))
    const family = String(evaluator.evaluate('mm_fontfamily(fontface)'))// mmFontFamily(fontface)
    console.log(this.constructor.name, "draw family", family)
    const {
      x, y, fontsize, fontcolor, text, textfile, shadowcolor, shadowx, shadowy
    } = evaluated
    if (!(fontsize && Is.aboveZero(fontsize))) throw Errors.eval.number + " fontsize"

    const height = Number(fontsize)
    const textStyle : TextStyle =  {
      height,
      family,
      color: String(fontcolor || 'black'),
      shadow: String(shadowcolor || ""),
      shadowPoint: { x: Number(shadowx || 0), y: Number(shadowy || 0) },
    }
    const point = { x: Number(x || 0), y: Number(y || 0) }
    const string = String(text || textfile)
    context.drawTextAtPoint(string, textStyle, point)
    return context
  }

  input(_evaluator: Evaluator, evaluated: ValueObject, args: FilterChainArgs): GraphFilter {
    const outWidth = evaluated.w || evaluated.width || 0
    const outHeight = evaluated.h || evaluated.height || 0
    const graphFilter: GraphFilter = {
      outputs: ['TEXT'],
      filter: this.ffmpegFilter,
      options: { width: outWidth, height: outHeight }
    }
    return graphFilter
  }

  parameters = [
    new Parameter({ name: "fontcolor", value: "#000000", dataType: DataType.Rgba }),
    new Parameter({ name: "shadowcolor", value: "#FFFFFF", dataType: DataType.Rgba }),
    new Parameter({ name: "fontsize", value: "out_height * 0.2" }),
    new Parameter({ name: "x", value: "0" }),
    new Parameter({ name: "y", value: "0" }),
    new Parameter({ name: "shadowx", value: "out_width * 0.015" }),
    new Parameter({ name: "shadowy", value: "out_width * 0.015" }),
    new Parameter({ name: "fontfile", value: "mm_fontfile(fontface)" }),
    new Parameter({ name: "textfile", value: "mm_textfile(string)" }),
  ]

  scopeSet(evaluator : Evaluator) : void {
    evaluator.set("text_w", 0) // width of the text to draw
    evaluator.set("text_h", 0) // height of the text to draw

    const mmFontFile = (id? : Value): string => {
      if (!Is.populatedString(id)) throw Errors.id + id

      const idString = String(id)
      const fontDefinition = fontDefinitionFromId(idString)
      const { source } = fontDefinition
      // console.log("mmFontFile", id, source)
      return source
    }

    const mmTextFile = (text? : Value) : string => String(text)

    const mmFontFamily = (id?: Value): string => {
      const source = mmFontFile(id)
      const { preloader } = evaluator
      if (!preloader) throw Errors.internal + 'mmFontFamily preloader false'


      const family = preloader.key({ type: LoadType.Font, file: source })
      // console.log("mmFontFamily", id, family)
      return family
    }


    evaluator.setFunction("mm_fontfamily", mmFontFamily)
    evaluator.setFunction("mm_textfile", mmTextFile)
    evaluator.setFunction("mm_fontfile", mmFontFile)
  }
}

export { DrawTextFilter }
