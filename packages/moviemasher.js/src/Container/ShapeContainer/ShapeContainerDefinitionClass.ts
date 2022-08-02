import { UnknownObject } from "../../declarations"
import { DataType, DefinitionType } from "../../Setup/Enums"
import { propertyInstance } from "../../Setup/Property"
import { DefinitionBase } from "../../Definition/DefinitionBase"
import { ContainerDefinitionMixin } from "../ContainerDefinitionMixin"
import { ShapeContainerClass } from "./ShapeContainerClass"
import {
  ShapeContainer, ShapeContainerDefinition,
  ShapeContainerDefinitionObject, ShapeContainerObject
} from "./ShapeContainer"
import { TweenableDefinitionMixin } from "../../Mixin/Tweenable/TweenableDefinitionMixin"
import { isAboveZero } from "../../Utility/Is"

const ShapeContainerDefinitionWithTweenable = TweenableDefinitionMixin(DefinitionBase)
const ShapeContainerDefinitionWithContainer = ContainerDefinitionMixin(ShapeContainerDefinitionWithTweenable)
export class ShapeContainerDefinitionClass extends ShapeContainerDefinitionWithContainer implements ShapeContainerDefinition {
  constructor(...args: any[]) {
    super(...args)
    const [object] = args
    const { path, pathHeight, pathWidth } = object as ShapeContainerDefinitionObject
    if (path) this.path = path
    if (isAboveZero(pathWidth)) this.pathWidth = pathWidth
    if (isAboveZero(pathHeight)) this.pathHeight = pathHeight
  }

  instanceFromObject(object: ShapeContainerObject = {}): ShapeContainer {
    return new ShapeContainerClass(this.instanceArgs(object))
  }

  path = ""

  pathHeight = 0

  pathWidth = 0

  toJSON(): UnknownObject {
    const object = super.toJSON()
    if (this.path) object.path = this.path
    if (isAboveZero(this.pathHeight)) object.pathHeight = this.pathHeight
    if (isAboveZero(this.pathWidth)) object.pathWidth = this.pathWidth
    return object
  }

  type = DefinitionType.Container
}
