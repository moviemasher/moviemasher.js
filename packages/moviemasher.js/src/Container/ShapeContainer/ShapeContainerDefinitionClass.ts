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

const ShapeContainerMixin = ContainerDefinitionMixin(DefinitionBase)
export class ShapeContainerDefinitionClass extends ShapeContainerMixin implements ShapeContainerDefinition {
  constructor(...args: any[]) {
    super(...args)


    const [object] = args
    const { path, pathHeight, pathWidth } = object as ShapeContainerDefinitionObject
    if (path) this.path = path
    if (pathWidth) this.pathWidth = pathWidth
    if (pathHeight) this.pathHeight = pathHeight
    // console.log(this.constructor.name, path, object)

    this.properties.push(...this.scaleFilterDefinition.properties)

    this.properties.push(propertyInstance({
      name: 'path', defaultValue: this.path, type: DataType.String
    }))
    this.properties.push(propertyInstance({
      name: 'pathWidth', defaultValue: this.pathWidth, type: DataType.Number
    }))
    this.properties.push(propertyInstance({
      name: 'pathHeight', defaultValue: this.pathHeight, type: DataType.Number
    }))

    // console.log(this.constructor.name, "constructor", this.properties)
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
    if (this.pathHeight) object.pathHeight = this.pathHeight
    if (this.pathWidth) object.pathWidth = this.pathWidth
    return object
  }

  type = DefinitionType.ShapeContainer
}
