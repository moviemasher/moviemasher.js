import { DataType } from "../../Setup/Enums"
import { FilterDefinitionClass } from "../FilterDefinitionClass"
import { Modes } from "../../Setup/Modes"
import { NamespaceSvg } from "../../Setup/Constants"
import { propertyInstance } from "../../Setup/Property"
import { assertDimensions, assertNumber, assertPoint, assertPopulatedString, isNumeric } from "../../Utility/Is"
import { Scalar, ScalarObject, SvgFilters, Value, ValueObject } from "../../declarations"
import { Dimensions } from "../../Setup/Dimensions"
import { CommandFilter, CommandFilters, FilterDefinitionCommandFilterArgs } from "../../MoveMe"
import { ModesFfmpeg } from "../../Setup/Modes"
import { PropertyTweenSuffix } from "../../Base/Propertied"
import { OpacityFilter } from "./OpacityFilter"
import { OverlayFilter } from "./OverlayFilter"
import { idGenerate } from "../../Utility/Id"
import { arrayLast } from "../../Utility/Array"

/**
 * @category Filter
 */
export class BlendFilter extends OverlayFilter {
  constructor(...args: any[]) {
    super(...args)
    this.properties.push(propertyInstance({ type: DataType.Mode }))
    this.populateParametersFromProperties()
  }


  commandFilters(args: FilterDefinitionCommandFilterArgs): CommandFilters {
    const { chainInput, filterInput, filter, duration, dimensions, videoRate } = args
    assertPopulatedString(chainInput, 'chainInput')
    assertPopulatedString(filterInput, 'filterInput')
    assertDimensions(dimensions)

    const commandFilters:CommandFilters = []
    const transparentCommandFilter = this.transparentCommandFilter(dimensions, videoRate, duration)
    commandFilters.push(transparentCommandFilter)
    const transparentId = arrayLast(transparentCommandFilter.outputs)
        
    const superArgs = { ...args, chainInput: transparentId }
    commandFilters.push(...super.commandFilters(superArgs))
    const lastFilter = arrayLast(commandFilters)

    const { ffmpegFilter } = this
    const superId = idGenerate(ffmpegFilter)
    lastFilter.outputs = [superId]
   
    const mode = filter.value('mode')
    const modeString = this.modeString(mode, false)
    const commandFilter: CommandFilter = {
      inputs: [superId], ffmpegFilter, 
      options: { all_mode: modeString, repeatlast: 0 },
      outputs: []
    }
    commandFilters.push(commandFilter)
    return commandFilters 
  }

  private modeString(value: Scalar, editing: Boolean): string {
    if (!value) return 'normal'

    if (!isNumeric(value)) return String(value)

    const array = editing ? Modes : ModesFfmpeg
    return array[Number(value)]
  }

  filterDefinitionSvgFilters(valueObject: ScalarObject): SvgFilters {
    const { mode } = valueObject
    const modeString = this.modeString(mode, true)
    assertPopulatedString(modeString)

    const blendElement = globalThis.document.createElementNS(NamespaceSvg, 'feBlend')
    blendElement.setAttribute('mode', modeString)
    return [blendElement]
  }
}
