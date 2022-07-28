import { CommandFilter, CommandFilters, FilterDefinitionCommandFilterArgs } from "../../MoveMe"
import { FilterDefinitionClass } from "../FilterDefinitionClass"
import { DataType, Phase } from "../../Setup/Enums"
import { propertyInstance } from "../../Setup/Property"
import { idGenerate } from "../../Utility/Id"
import { colorBlack, colorRgbaKeys, colorRgbKeys, colorToRgb, colorToRgba } from "../../Utility/Color"
import { assertAboveZero, assertNumber, assertPopulatedString, isAboveZero, isPopulatedString } from "../../Utility/Is"
import { PropertyTweenSuffix } from "../../Base/Propertied"
import { ValueObject } from "../../declarations"
import { tweenPosition } from "../../Utility/Tween"

/**
 * @category Filter
 */
export class ColorizeFilter extends FilterDefinitionClass {
  constructor(...args: any[]) {
    super(...args)
    this.properties.push(propertyInstance({
      tweenable: true, custom: true, name: 'color', type: DataType.String, 
    }))
    this.populateParametersFromProperties()
  }

  alpha = false

  _ffmpegFilter = 'geq'

  commandFilters(args: FilterDefinitionCommandFilterArgs): CommandFilters {
    const commandFilters: CommandFilters = []
    const { filter, videoRate, duration, filterInput: input } = args
    assertNumber(duration, 'duration')
    assertNumber(videoRate, 'videoRate')
    const color = filter.value('color')
    assertPopulatedString(color, 'color')
    let filterInput = input
    assertPopulatedString(filterInput, 'filterInput')


    const formatFilter = 'format'
    const formatId = idGenerate(formatFilter)
    const formatCommandFilter: CommandFilter = {
      inputs: [filterInput], ffmpegFilter: formatFilter, 
      options: { pix_fmts: 'rgba' }, outputs: [formatId]
    }
    commandFilters.push(formatCommandFilter)
    filterInput = formatId
 

    // const setptsFilter = 'setpts'
    // const setptsId = idGenerate(setptsFilter)
    // const setptsCommandFilter: CommandFilter = {
    //   inputs: [filterInput], ffmpegFilter: setptsFilter, 
    //   options: { expr: 'PTS-STARTPTS' }, outputs: [setptsId]
    // }
    // commandFilters.push(setptsCommandFilter)
    // filterInput = setptsId
 

    const colorEnd = filter.value(`color${PropertyTweenSuffix}`) || color
    assertPopulatedString(colorEnd)

    const alpha = color.length > 7
    const fromColor = alpha ? colorToRgba(color) : colorToRgb(color)
    const toColor = alpha ? colorToRgba(colorEnd) : colorToRgb(colorEnd)

    const keys = alpha ? colorRgbaKeys : colorRgbKeys
    const options: ValueObject = {}

    const position = duration ? tweenPosition(videoRate, duration, 'N') : 0

    keys.forEach(key => {
      const from = fromColor[key]
      const to = toColor[key]
      if (from === to) options[key] = from
      else options[key] = `${from}+(${to - from}*${position})`
    })
    if (!alpha) options.a = 'alpha(X,Y)'

    const geqFilter = 'geq'
    const geqFilterId = idGenerate(geqFilter)
    const geqCommandFilter: CommandFilter = {
      inputs: [filterInput], ffmpegFilter: geqFilter, 
      options, outputs: [geqFilterId]
    }
    commandFilters.push(geqCommandFilter)
    return commandFilters
  }

  phase = Phase.Initialize
}
