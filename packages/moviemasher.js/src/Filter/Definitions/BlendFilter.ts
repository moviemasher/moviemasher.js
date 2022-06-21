import { DataType } from "../../Setup/Enums"
import { FilterDefinitionClass } from "../FilterDefinitionClass"
import { Modes } from "../../Setup/Modes"
import { NamespaceSvg } from "../../Setup/Constants"
import { propertyInstance } from "../../Setup/Property"
import { assertPopulatedString, isNumeric } from "../../Utility/Is"
import { SvgFilters, Value, ValueObject } from "../../declarations"
import { Dimensions } from "../../Setup/Dimensions"
import { CommandFilter } from "../../MoveMe"
import { ModesFfmpeg } from "../../Setup"
import { ServerFilters } from "../Filter"
import { FilterChain } from "../../Edited/Mash/FilterChain/FilterChain"

/**
 * @category Filter
 */
export class BlendFilter extends FilterDefinitionClass {
  constructor(...args: any[]) {
    super(...args)
    this.properties.push(propertyInstance({
      custom: true, type: DataType.Mode
    }))
    this.populateParametersFromProperties()
  }

  serverFilters(_: FilterChain, valueObject: ValueObject): ServerFilters {
    const modeString = this.modeString(valueObject.mode, false)
    const { ffmpegFilter } = this
    const commandFilter: CommandFilter = {
      ffmpegFilter, options: { all_mode: modeString , repeatlast: 0}
    }
    return [commandFilter]
  }

  private modeString(value: Value, editing: Boolean): string {
    if (!value) return 'normal'

    if (!isNumeric(value)) return String(value)

    const array = editing ? Modes : ModesFfmpeg
    return array[Number(value)]
  }

  svgFilters(_: Dimensions, valueObject: ValueObject): SvgFilters {
    const modeString = this.modeString(valueObject.mode, true)
    assertPopulatedString(modeString)

    const blendElement = globalThis.document.createElementNS(NamespaceSvg, 'feBlend')
    blendElement.setAttribute('mode', modeString)
    return [blendElement]
  }
}
