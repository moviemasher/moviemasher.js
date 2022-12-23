import { Constrained, SvgFilters } from "../../declarations"
import { Definition, DefinitionObject } from "../../Definition/Definition"
import { Filter, FilterDefinitionObject } from "../../Filter/Filter"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { Instance, InstanceObject } from "../../Instance/Instance"
import { CommandFiles, CommandFilterArgs, CommandFilters, VisibleCommandFileArgs } from "../../MoveMe"
import { PropertyObject } from "../../Setup/Property"
import { Rect } from "../../Utility/Rect"
import { Size } from "../../Utility/Size"


export interface ModularObject extends InstanceObject {
  id?: string
}

export interface Modular extends Instance {
  definition: ModularDefinition
  svgFilters(previewSize: Size, containerRect: Rect, time: Time, range: TimeRange): SvgFilters
  commandFilters(args: CommandFilterArgs): CommandFilters
  commandFiles(args: VisibleCommandFileArgs): CommandFiles
}

export interface ModularDefinitionObject extends DefinitionObject {
  initializeFilter?: FilterDefinitionObject
  finalizeFilter?: FilterDefinitionObject
  filters? : FilterDefinitionObject[]
  properties? : PropertyObject[]
}

export interface ModularDefinition extends Definition {
  filters: Filter[]
}

export type ModularClass = Constrained<Modular>
export type ModularDefinitionClass = Constrained<ModularDefinition>
