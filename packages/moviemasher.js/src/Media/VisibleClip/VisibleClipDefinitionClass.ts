import { VisibleClip, VisibleClipDefinition, VisibleClipObject } from "./VisibleClip"
import { VisibleClipClass } from "./VisibleClipClass"
import { ClipDefinitionMixin } from "../../Mixin/Clip/ClipDefinitionMixin"
import { VisibleDefinitionMixin } from "../../Mixin/Visible/VisibleDefinitionMixin"
import { DataType, DefinitionType } from "../../Setup/Enums"
import { DefinitionBase } from "../../Definition/DefinitionBase"
import { propertyInstance } from "../../Setup/Property"
import { IdPrefix, IdSuffix } from "../../Setup"

const VisibleClipMixin = VisibleDefinitionMixin(ClipDefinitionMixin(DefinitionBase))
export class VisibleClipDefinitionClass extends VisibleClipMixin implements VisibleClipDefinition {
  constructor(...args: any[]) {
    super(...args)
    this.properties.push(propertyInstance({
      name: "containerId", type: DataType.ContainerId,
      defaultValue: `${IdPrefix}shapecontainer${IdSuffix}`
    }))
    this.properties.push(propertyInstance({
      name: "contentId", type: DataType.ContentId,
      defaultValue: `${IdPrefix}colorcontent${IdSuffix}`
    }))
  }

  instanceFromObject(object: VisibleClipObject = {}): VisibleClip {
    return new VisibleClipClass(this.instanceArgs(object))
  }

  type = DefinitionType.Visible
}
