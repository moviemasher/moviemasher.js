import { VisibleContext } from "../../../Context/VisibleContext"
import { ValueObject } from "../../../declarations"
import { Evaluator } from "../../../Helpers/Evaluator"
import { FilterDefinitionClass } from "../FilterDefinition"
import { Errors } from "../../../Setup/Errors"
import { Parameter } from "../../../Setup"

/**
 * @category Filter
 */
class ColorChannelMixerFilter extends FilterDefinitionClass {
  draw(evaluator : Evaluator) : VisibleContext {
    const map = Object.fromEntries(Object.entries(evaluator.valueObject).map(entry => {
      const [key, value] = entry
      return [key, Number(value)]
    }))
    const { context } = evaluator
    if (!context) throw Errors.invalid.context

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

  parameters: Parameter[] = [
    new Parameter({ "name": "rr", "value": 0.3 }),
    new Parameter({ "name": "rg", "value": 0.4 }),
    new Parameter({ "name": "rb", "value": 0.3 }),
    new Parameter({ "name": "ra", "value": 0 }),
    new Parameter({ "name": "gr", "value": 0.3 }),
    new Parameter({ "name": "gg", "value": 0.4 }),
    new Parameter({ "name": "gb", "value": 0.3 }),
    new Parameter({ "name": "ga", "value": 0 }),
    new Parameter({ "name": "br", "value": 0.3 }),
    new Parameter({ "name": "bg", "value": 0.4 }),
    new Parameter({ "name": "bb", "value": 0.3 }),
    new Parameter({ "name": "ba", "value": 0 }),
    new Parameter({ "name": "ar", "value": 0 }),
    new Parameter({ "name": "ag", "value": 0 }),
    new Parameter({ "name": "ab", "value": 0 }),
    new Parameter({ "name": "aa", "value": 1 }),
  ]
}

export { ColorChannelMixerFilter }
