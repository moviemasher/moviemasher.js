import { ImageAsset } from "@moviemasher/runtime-shared";
import { Constrained } from "@moviemasher/runtime-shared";
import { VisibleInstance } from "@moviemasher/runtime-shared";
import { ImageInstance } from "@moviemasher/runtime-shared";

export function ImageInstanceMixin
<T extends Constrained<VisibleInstance>>(Base: T): 
T & Constrained<ImageInstance> {
  return class extends Base implements ImageInstance {
    declare asset: ImageAsset
  }
}
