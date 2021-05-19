import { CoreFilter } from "./CoreFilter"
import { Cache } from "../Loading"
import { Module } from "../Setup"
import { Pixel } from "../Utilities"

const mm_fontfile = font_id => Module.fontById(font_id).source
const mm_textfile = text => text
const mm_fontfamily = font_id => Cache.key(mm_fontfile(font_id))

class DrawTextFilter extends CoreFilter {
  get parameters() {
    return [
      {
        "name": "fontcolor",
        "value":"#000000"
      },{
        "name": "shadowcolor",
        "value":"#FFFFFF"
      },{
        "name": "fontsize",
        "value":"mm_vert(20)"
      },{
        "name": "x",
        "value":"0"
      },{
        "name": "y",
        "value":"0"
      },{
        "name": "shadowx",
        "value":"mm_horz(5)"
      },{
        "name": "shadowy",
        "value":"mm_vert(5)"
      },{
        "name": "fontfile",
        "value":"mm_fontfile('com.moviemasher.font.default')"
      },{
        "name": "textfile",
        "value":"Hello World"
      }
    ]
  }

  draw(evaluator, evaluated) {
    // console.log(this.constructor.name, "draw", evaluator, evaluated)
    const context = evaluator.context
    const family = mm_fontfamily(evaluator.get("fontface"))
    const { x, y, fontsize, fontcolor, text, textfile, shadowcolor } = evaluated

    if (shadowcolor) {
      context.shadowColor = shadowcolor
      const { shadowx, shadowy/*, shadowblur */ } = evaluated
      // shadowblur not supported in ffmpeg
      // context.shadowBlur = shadowblur
      context.shadowOffsetX = shadowx || 0
      context.shadowOffsetY = shadowy || 0
    }

    context.font = `${fontsize}px "${family}"`
    context.fillStyle = Pixel.color(fontcolor)
    context.fillText(text || textfile, x, Number(y) + Number(fontsize))

    if (shadowcolor) {
      context.shadowColor = null
      context.shadowOffsetX = 0
      context.shadowOffsetY = 0
      // context.shadowBlur = 0
    }
    return context
  }
  scopeSet(evaluator) {
    evaluator.set("text_w", 0) // width of the text to draw
    evaluator.set("text_h", 0) // height of the text to draw
    evaluator.set("mm_fontfamily", mm_fontfamily)
    evaluator.set("mm_textfile", mm_textfile)
    evaluator.set("mm_fontfile", mm_fontfile)
  }
}

const DrawTextFilterInstance = new DrawTextFilter
export { DrawTextFilterInstance as DrawTextFilter }
