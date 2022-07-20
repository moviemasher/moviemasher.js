import { GenericFactory } from "../../declarations"
import { GraphFileArgs, GraphFiles } from "../../MoveMe"
import { Definition, DefinitionObject, isDefinition } from "../../Definition/Definition"
import { Instance, InstanceObject } from "../../Instance/Instance"
import { DefinitionType } from "../../Setup/Enums"

export type FontObject = InstanceObject

export interface Font extends Instance {
  definition: FontDefinition
  graphFiles(args: GraphFileArgs): GraphFiles
}

export interface FontDefinitionObject extends DefinitionObject {
  source?: string
  url?: string
}

export interface FontDefinition extends Definition {
  instanceFromObject(object?: FontObject): Font
  source: string
  family: string
  url: string
  urlAbsolute: string
  graphFiles(args: GraphFileArgs): GraphFiles
}
export const isFontDefinition = (value: any): value is FontDefinition => {
  return isDefinition(value) && value.type === DefinitionType.Font
}
export function assertFontDefinition(value: any): asserts value is FontDefinition {
  if (!isFontDefinition(value)) throw new Error("expected FontDefinition")
}
/**
 * @category Factory
 */
export interface FontFactory extends GenericFactory<
  Font, FontObject, FontDefinition, FontDefinitionObject
> {}
