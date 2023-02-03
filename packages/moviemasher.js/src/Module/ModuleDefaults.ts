import { Definitions } from "../Definition/Definition";
import { DefinitionType, ModuleDefinitionType } from "../Setup/Enums";

export const ModuleDefaults: Record<ModuleDefinitionType, Definitions> = {
  [DefinitionType.Effect]: [],
  [DefinitionType.Filter]: [],
}
