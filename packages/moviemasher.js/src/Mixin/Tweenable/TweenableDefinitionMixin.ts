import { DefinitionClass } from "../../Definition/Definition"
import { TweenableDefinition, TweenableDefinitionClass } from "./Tweenable"

export function TweenableDefinitionMixin<T extends DefinitionClass>(Base: T): TweenableDefinitionClass & T {
  return class extends Base implements TweenableDefinition {}
}
