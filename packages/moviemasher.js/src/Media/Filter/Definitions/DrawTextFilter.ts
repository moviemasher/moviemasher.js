import { cacheKey } from "../../../Loader"
import { Is } from "../../../Utilities/Is"
import { Parameter } from "../../../Setup/Parameter"
import { GraphFilter, Value, TextStyle, ValueObject } from "../../../declarations"
import { Errors } from "../../../Setup/Errors"
import { FilterDefinitionClass } from "../FilterDefinition"
import { VisibleContext } from "../../../Context"
import { fontDefinitionFromId } from "../../Font/FontFactory"
import { Evaluator } from "../../../Helpers/Evaluator"

const mmFontFile = (id? : Value) : string => {
  if (!Is.populatedString(id)) throw Errors.id + id

  return fontDefinitionFromId(<string> id).absoluteUrl
}

const mmTextFile = (text? : Value) : string => String(text)

const mmFontFamily = (id? : Value) : string => cacheKey(mmFontFile(id))

class DrawTextFilter extends FilterDefinitionClass {
  draw(evaluator : Evaluator, evaluated : ValueObject) : VisibleContext {
    const { context } = evaluator
    if (!context) throw Errors.invalid.context

    const fontface = String(evaluator.get("fontface"))
    const family = mmFontFamily(fontface)
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

  input(_evaluator: Evaluator, evaluated: ValueObject): GraphFilter {
    const outWidth = evaluated.w || evaluated.width || 0
    const outHeight = evaluated.h || evaluated.height || 0
    const graphFilter: GraphFilter = {
      filter: this.id,
      options: { width: outWidth, height: outHeight }
    }

    return graphFilter
  }

  parameters = [
    new Parameter({ name: "fontcolor", value: "#000000" }),
    new Parameter({ name: "shadowcolor", value: "#FFFFFF" }),
    new Parameter({ name: "fontsize", value: "mm_vert(0.2)" }),
    new Parameter({ name: "x", value: "0" }),
    new Parameter({ name: "y", value: "0" }),
    new Parameter({ name: "shadowx", value: "mm_horz(0.015)" }),
    new Parameter({ name: "shadowy", value: "mm_vert(0.015)" }),
    new Parameter({ name: "fontfile", value: "mmFontFile('com.moviemasher.font.default')" }),
    new Parameter({ name: "textfile", value: "Hello World" }),
  ]

  scopeSet(evaluator : Evaluator) : void {
    evaluator.set("text_w", 0) // width of the text to draw
    evaluator.set("text_h", 0) // height of the text to draw
    evaluator.set("mmFontFamily", mmFontFamily)
    evaluator.set("mmTextFile", mmTextFile)
    evaluator.set("mmFontFile", mmFontFile)

    // support deprecated snake case
    evaluator.set("mm_fontfamily", mmFontFamily)
    evaluator.set("mm_textfile", mmTextFile)
    evaluator.set("mm_fontfile", mmFontFile)
  }
}

export { DrawTextFilter }
