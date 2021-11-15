import { Cache } from "../../../Loading"
import { Evaluator, Is } from "../../../Utilities"
import { Parameter } from "../../../Setup/Parameter"
import { ScalarValue, TextStyle, ValueObject } from "../../../declarations"
import { Errors } from "../../../Setup/Errors"
import { FilterDefinitionClass } from "../FilterDefinition"
import { VisibleContext } from "../../../Playing"
import { fontDefinitionFromId } from "../../Font/FontFactory"

const mmFontFile = (id? : ScalarValue) : string => {
  if (!Is.populatedString(id)) throw Errors.id

  return fontDefinitionFromId(<string> id).absoluteUrl
}

const mmTextFile = (text? : ScalarValue) : string => String(text)

const mmFontFamily = (id? : ScalarValue) : string => Cache.key(mmFontFile(id))

class DrawTextFilter extends FilterDefinitionClass {
  draw(evaluator : Evaluator, evaluated : ValueObject) : VisibleContext {
    const { context } = evaluator
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

  parameters = [
    new Parameter({ name: "fontcolor", value: "#000000" }),
    new Parameter({ name: "shadowcolor", value: "#FFFFFF" }),
    new Parameter({ name: "fontsize", value: "mm_vert(20)" }),
    new Parameter({ name: "x", value: "0" }),
    new Parameter({ name: "y", value: "0" }),
    new Parameter({ name: "shadowx", value: "mm_horz(5)" }),
    new Parameter({ name: "shadowy", value: "mm_vert(5)" }),
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
