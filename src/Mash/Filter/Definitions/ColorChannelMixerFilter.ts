import { VisibleContext } from "../../../Playing"
import { ValueObject } from "../../../Setup/declarations"
import { Evaluator } from "../../../Utilities"
import { FilterDefinitionClass } from "../FilterDefinition"

class ColorChannelMixerFilter extends FilterDefinitionClass {
  draw(evaluator : Evaluator, evaluated : ValueObject) : VisibleContext {
    const map = Object.fromEntries(Object.entries(evaluated).map(entry => {
      const [key, value] = entry
      return [key, Number(value)]
    }))
    const { context } = evaluator
    const rgbas = 'rgba'.split('')
    rgbas.forEach(first => {
      rgbas.forEach(second => {
        const key = `${first}${second}`
        if (map[key] === null) map[key] = first === second ? 1.0 : 0.0
      })
    })
    const { imageData } = context
    const { data } = imageData
    data.forEach((r, i) => {
      const g = data[i + 1]
      const b = data[i + 2]
      const a = data[i + 3]
      data[i] = r * map.rr + g * map.rg + b * map.rb + a * map.ra
      data[i + 1] = r * map.gr + g * map.gg + b * map.gb + a * map.ga
      data[i + 2] = r * map.br + g * map.bg + b * map.bb + a * map.ba
      data[i + 3] = r * map.ar + g * map.ag + b * map.ab + a * map.aa
    })
    context.drawImageData(imageData)
    return context
  }

  id = 'colorchannelmixer'

}

export { ColorChannelMixerFilter }
