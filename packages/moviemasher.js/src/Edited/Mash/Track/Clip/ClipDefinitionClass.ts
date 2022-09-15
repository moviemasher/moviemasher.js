import { Clip, ClipDefinition, ClipObject } from "./Clip"
import { ClipClass } from "./ClipClass"
import { DataType, DefinitionType, Duration, Sizing, Timing } from "../../../../Setup/Enums"
import { DefinitionBase } from "../../../../Definition/DefinitionBase"
import { DataGroup, propertyInstance } from "../../../../Setup/Property"
import { ContainerDefaultId } from "../../../../Container/Container"
import { ContentDefaultId } from "../../../../Content/Content"
import { isUndefined } from "../../../../Utility/Is"

export class ClipDefinitionClass extends DefinitionBase implements ClipDefinition {
  constructor(...args: any[]) {
    super(...args)
    this.properties.push(propertyInstance({
      name: "containerId", type: DataType.ContainerId,
      defaultValue: ContainerDefaultId
    }))
    this.properties.push(propertyInstance({
      name: "contentId", type: DataType.ContentId,
      defaultValue: ContentDefaultId
    }))
    this.properties.push(propertyInstance({ name: "label", type: DataType.String }))
    this.properties.push(propertyInstance({ 
      name: "sizing", type: DataType.Sizing, defaultValue: Sizing.Content,
      // group: DataGroup.Sizing,
    }))
    this.properties.push(propertyInstance({ 
      name: "timing", type: DataType.Timing, defaultValue: Timing.Content,
      group: DataGroup.Timing,
    }))
    this.properties.push(propertyInstance({ 
      type: DataType.Frame, 
      group: DataGroup.Timing, 
      defaultValue: Duration.None, min: 0, step: 1
    }))
    this.properties.push(propertyInstance({ 
      name: "frames", type: DataType.Frame, defaultValue: Duration.Unknown,
      min: 1, step: 1,
      group: DataGroup.Timing,
    }))
  }

  audible = false
    
  instanceArgs(object: ClipObject = {}): ClipObject {
    const args = super.instanceArgs(object) as ClipObject
    const { containerId, contentId } = args
    const defaultContent = isUndefined(contentId) || contentId === ContentDefaultId
    let defaultContainer = isUndefined(containerId) || containerId === ContainerDefaultId
    if (args.sizing === Sizing.Content && defaultContent) {
      // console.log("instanceArgs setting sizing to container", object)
      args.sizing = Sizing.Container
    }
    if (args.sizing === Sizing.Container && defaultContainer) {
      // console.log("instanceArgs setting sizing to preview", object)
      args.sizing = Sizing.Preview
    }
    if (args.timing === Timing.Content && defaultContent) {
      args.timing = Timing.Container
    }
    if (args.timing === Timing.Container && defaultContainer) {
      args.timing = Timing.Custom
    }
    // console.log("instanceArgs", args)
    return args
  }

  instanceFromObject(object: ClipObject = {}): Clip {
    return new ClipClass(this.instanceArgs(object))
  }

  streamable = false

  type = DefinitionType.Clip

  visible = false
}
