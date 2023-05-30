import { ImageAsset } from "./ImageAsset.js";
import { Constrained } from "../../Base/Constrained.js";
import { VisibleInstance } from "../Instance/Instance.js";
import { ImageInstance } from "./ImageInstance.js";

export function ImageInstanceMixin
<T extends Constrained<VisibleInstance>>(Base: T): 
T & Constrained<ImageInstance> {
  return class extends Base implements ImageInstance {
    declare asset: ImageAsset
  }
}
